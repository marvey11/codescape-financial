import {
  FLOATING_POINT_TOLERANCE,
  isEffectivelyZero,
} from "@codescape-financial/core";
import { StockMetadata } from "@codescape-financial/historical-data-access";
import {
  CreateBuyTransactionDTO,
  CreateDividendDTO,
  CreateSellTransactionDTO,
  CreateStockSplitDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";
import {
  OperationType,
  Portfolio,
  PortfolioBuyTransaction,
  PortfolioHolding,
  PortfolioOperation,
} from "../entities/index";
import { PortfolioService } from "./portfolio.service";

@Injectable()
export class PortfolioOperationService {
  constructor(
    @InjectRepository(PortfolioOperation)
    private readonly operationRepository: Repository<PortfolioOperation>,
    private readonly portfolioService: PortfolioService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<PortfolioOperation[]> {
    return this.operationRepository.find({
      relations: ["holding", "holding.stockMetadata"],
      order: { date: "DESC" },
    });
  }

  async createBuyOperation(
    data: CreateBuyTransactionDTO,
  ): Promise<PortfolioOperation> {
    return this.dataSource.transaction(async (manager) => {
      const { portfolioId, stockId, shares, date, ...operationData } = data;

      const holding = await this.getOrCreateHolding(
        portfolioId,
        stockId,
        manager,
      );

      const operation = manager.create(PortfolioOperation, {
        type: OperationType.BUY,
        date: new Date(date),
        holdingId: holding.id,
        numberOfShares: shares,
        ...operationData,
      });
      await manager.save(operation);

      await this.applyBuyOperation(holding, operation, manager);
      await manager.save(holding);

      await this.portfolioService.updatePortfolioAggregates(
        holding.portfolioId,
        manager,
      );

      return operation;
    });
  }

  async createSellOperation(
    data: CreateSellTransactionDTO,
  ): Promise<PortfolioOperation> {
    return this.dataSource.transaction(async (manager) => {
      const { portfolioId, stockId, shares, date, ...operationData } = data;

      const holding = await this.getOrCreateHolding(
        portfolioId,
        stockId,
        manager,
      );

      const operation = manager.create(PortfolioOperation, {
        type: OperationType.SELL,
        date: new Date(date),
        holdingId: holding.id,
        numberOfShares: shares,
        ...operationData,
      });

      await manager.save(operation);

      await this.applySellOperation(holding, operation, manager);
      await manager.save(holding);

      await this.portfolioService.updatePortfolioAggregates(
        holding.portfolioId,
        manager,
      );

      return operation;
    });
  }

  async createDividendOperation(
    data: CreateDividendDTO,
  ): Promise<PortfolioOperation> {
    return this.dataSource.transaction(async (manager) => {
      const { portfolioId, stockId, date, ...operationData } = data;
      const holding = await this.getOrCreateHolding(
        portfolioId,
        stockId,
        manager,
      );

      const operation = manager.create(PortfolioOperation, {
        type: OperationType.DIVIDEND,
        date: new Date(date),
        holdingId: holding.id,
        ...operationData,
      });
      await manager.save(operation);

      this.applyDividendOperation(holding, operation);
      await manager.save(holding);

      await this.portfolioService.updatePortfolioAggregates(
        holding.portfolioId,
        manager,
      );

      return operation;
    });
  }

  async createStockSplitOperation(
    data: CreateStockSplitDTO,
  ): Promise<PortfolioOperation> {
    return this.dataSource.transaction(async (manager) => {
      const { portfolioId, stockId, date, ...operationData } = data;
      const holding = await this.getOrCreateHolding(
        portfolioId,
        stockId,
        manager,
      );

      const operation = manager.create(PortfolioOperation, {
        type: OperationType.STOCK_SPLIT,
        date: new Date(date),
        holdingId: holding.id,
        ...operationData,
      });
      await manager.save(operation);

      await this.applyStockSplitOperation(holding, operation, manager);
      await manager.save(holding);

      await this.portfolioService.updatePortfolioAggregates(
        holding.portfolioId,
        manager,
      );

      return operation;
    });
  }

  private async applyBuyOperation(
    holding: PortfolioHolding,
    operation: PortfolioOperation,
    manager: EntityManager,
  ): Promise<void> {
    const { numberOfShares, pricePerShare, fees = 0 } = operation;

    if (numberOfShares == null || pricePerShare == null) {
      // should not happen due to validation in the controller
      throw new Error(
        "Number of Shares and Price per Share are required for a buy operation",
      );
    }

    const buyTxRepo = manager.getRepository(PortfolioBuyTransaction);

    const newBuyTransaction = buyTxRepo.create({
      holdingId: holding.id,
      transactionDate: operation.date,
      shares: numberOfShares,
      originalShares: numberOfShares,
      pricePerShare: pricePerShare,
      fees: fees,
    });
    await buyTxRepo.save(newBuyTransaction);

    holding.buyTransactions.push(newBuyTransaction);
    holding.fees = Number(holding.fees) + fees;

    this.updateAggregatesFromInventory(holding);
  }

  private async applySellOperation(
    holding: PortfolioHolding,
    operation: PortfolioOperation,
    manager: EntityManager,
  ): Promise<void> {
    const {
      numberOfShares,
      pricePerShare,
      fees: sellFees = 0,
      taxes = 0,
    } = operation;

    if (numberOfShares == null || pricePerShare == null) {
      // should not happen due to validation in the controller
      throw new Error(
        "Number of Shares and Price per Share are required for a sell operation",
      );
    }

    const buyTxRepo = manager.getRepository(PortfolioBuyTransaction);

    let sharesToSell = numberOfShares;

    if (sharesToSell - holding.shares > FLOATING_POINT_TOLERANCE) {
      throw new Error(
        `Cannot sell more shares than are currently in this portfolio holding`,
      );
    }

    let costBasisOfSoldShares = 0;
    const transactionsToDelete: PortfolioBuyTransaction[] = [];
    const transactionsToUpdate: PortfolioBuyTransaction[] = [];

    for (const buyTx of holding.buyTransactions) {
      if (isEffectivelyZero(sharesToSell)) {
        break;
      }

      const sharesSoldFromTx = Math.min(sharesToSell, Number(buyTx.shares));

      // Calculate the prorated fee for the shares being sold from this specific buy transaction.
      const buyFeeForLot =
        (Number(buyTx.fees) / Number(buyTx.originalShares)) * sharesSoldFromTx;

      // The cost basis for this portion of the sale includes the share price and the prorated fee.
      costBasisOfSoldShares +=
        sharesSoldFromTx * Number(buyTx.pricePerShare) + buyFeeForLot;
      buyTx.shares = Number(buyTx.shares) - sharesSoldFromTx;

      if (isEffectivelyZero(buyTx.shares)) {
        transactionsToDelete.push(buyTx);
      } else {
        transactionsToUpdate.push(buyTx);
      }

      sharesToSell -= sharesSoldFromTx;
    }

    // Total proceeds are the sale value minus the fees for this sale.
    const saleProceeds = numberOfShares * pricePerShare - sellFees;

    // The net realized gain is the proceeds minus the adjusted cost basis of the shares sold.
    holding.realizedGains =
      Number(holding.realizedGains) + (saleProceeds - costBasisOfSoldShares);
    holding.fees = Number(holding.fees) + sellFees;
    holding.salesTaxes = Number(holding.salesTaxes) + taxes;

    await buyTxRepo.save(transactionsToUpdate);
    await buyTxRepo.remove(transactionsToDelete);

    holding.buyTransactions = holding.buyTransactions.filter(
      (tx) => !isEffectivelyZero(tx.shares),
    );

    this.updateAggregatesFromInventory(holding);
  }

  private async applyDividendOperation(
    holding: PortfolioHolding,
    operation: PortfolioOperation,
  ): Promise<void> {
    const {
      dividendPerShare,
      applicableShares,
      exchangeRate = 1,
      taxes = 0,
    } = operation;

    if (dividendPerShare == null || applicableShares == null) {
      // should not happen due to validation in the controller
      throw new Error(
        "Dividend per Share and Number of Applicable Shares are required for a dividend operation",
      );
    }

    holding.dividends =
      Number(holding.dividends) +
      (dividendPerShare * applicableShares) / exchangeRate;
    holding.totalDividendTaxes = Number(holding.totalDividendTaxes) + taxes;
  }

  private async applyStockSplitOperation(
    holding: PortfolioHolding,
    operation: PortfolioOperation,
    manager: EntityManager,
  ) {
    const { splitRatio } = operation;

    if (splitRatio == null) {
      // should not happen due to validation in the controller
      throw new Error("Split Ratio is required for a stock split operation");
    }

    const buyTxRepo = manager.getRepository(PortfolioBuyTransaction);
    for (const tx of holding.buyTransactions) {
      tx.shares = Number(tx.shares) * splitRatio;
      tx.pricePerShare = Number(tx.pricePerShare) / splitRatio;
    }

    await buyTxRepo.save(holding.buyTransactions);
    this.updateAggregatesFromInventory(holding);
  }

  private async getOrCreateHolding(
    portfolioId: string,
    stockId: string,
    manager: EntityManager,
  ): Promise<PortfolioHolding> {
    const portfolioRepo = manager.getRepository(Portfolio);

    const portfolio = await portfolioRepo.findOne({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio with ID "${portfolioId}" not found`,
      );
    }

    const stockRepo = manager.getRepository(StockMetadata);

    const stock = await stockRepo.findOne({
      where: { id: stockId },
    });

    if (!stock) {
      throw new NotFoundException(`Stock with ID "${stockId}" not found`);
    }

    const holdingRepo = manager.getRepository(PortfolioHolding);

    let holding = await holdingRepo.findOne({
      where: { stockId, portfolioId },
      relations: ["buyTransactions"], // Eager loading on entity handles this, but explicit is fine
    });

    if (!holding) {
      holding = holdingRepo.create({
        portfolioId,
        portfolio,
        stockId,
        stockMetadata: stock,
        buyTransactions: [],
      });
      await holdingRepo.save(holding);
    }

    return holding;
  }

  private updateAggregatesFromInventory(holding: PortfolioHolding): void {
    const totalShares = holding.buyTransactions.reduce(
      (sum, tx) => sum + Number(tx.shares),
      0,
    );

    const totalCostBasis = holding.buyTransactions.reduce(
      (sum, tx) =>
        sum + Number(tx.shares) * Number(tx.pricePerShare) + Number(tx.fees),
      0,
    );

    holding.shares = totalShares;
    holding.totalCostBasis = totalCostBasis;
    holding.averagePricePerShare =
      totalShares > 0 ? totalCostBasis / totalShares : 0;
  }
}
