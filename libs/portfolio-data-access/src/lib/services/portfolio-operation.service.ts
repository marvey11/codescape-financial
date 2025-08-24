import {
  FLOATING_POINT_TOLERANCE,
  generateHoldingListXirrKey,
  generateHoldingXirrKey,
  generatePortfolioAllocationKey,
  generatePortfolioXirrKey,
  isEffectivelyZero,
} from "@codescape-financial/core";
import { StockMetadata } from "@codescape-financial/historical-data-access";
import {
  CreateBuyTransactionDTO,
  CreateDividendDTO,
  CreateSellTransactionDTO,
  CreateStockSplitDTO,
  OperationType,
} from "@codescape-financial/portfolio-data-models";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Cache } from "cache-manager";
import { DataSource, EntityManager, Repository } from "typeorm";
import {
  Portfolio,
  PortfolioBuyTransaction,
  PortfolioHolding,
  PortfolioOperation,
} from "../entities";
import { PortfolioService } from "./portfolio.service";
import { TaxCalculationService } from "./tax-calculation.service";

@Injectable()
export class PortfolioOperationService {
  private readonly logger = new Logger(PortfolioOperationService.name);

  constructor(
    @InjectRepository(PortfolioOperation)
    private readonly operationRepository: Repository<PortfolioOperation>,
    private readonly portfolioService: PortfolioService,
    private readonly taxCalculationService: TaxCalculationService,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
      const {
        portfolioId,
        stockId,
        shares,
        date,
        pricePerShare,
        fees = 0,
      } = data;

      const holding = await this.getOrCreateHolding(
        portfolioId,
        stockId,
        manager,
      );

      this.invalidateXirrCaches(portfolioId, holding.id);

      const operation = manager.create(PortfolioOperation, {
        type: OperationType.BUY,
        date: new Date(date),
        holdingId: holding.id,
        numberOfShares: String(shares),
        pricePerShare: String(pricePerShare),
        fees: String(fees),
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
      const {
        portfolioId,
        stockId,
        shares,
        date,
        pricePerShare,
        fees = 0,
        taxes = 0,
      } = data;

      const holding = await this.getOrCreateHolding(
        portfolioId,
        stockId,
        manager,
      );

      this.invalidateXirrCaches(portfolioId, holding.id);

      const operation = manager.create(PortfolioOperation, {
        type: OperationType.SELL,
        date: new Date(date),
        holdingId: holding.id,
        numberOfShares: String(shares),
        pricePerShare: String(pricePerShare),
        fees: String(fees),
        taxes: String(taxes),
      });

      // Calculate effects of the sale, including FIFO cost basis and taxes,
      // and apply them to the holding and the operation entity itself.
      await this.applySellOperation(holding, operation, manager);

      // Now save the operation, which includes the calculated taxes.
      await manager.save(operation);
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
      const {
        portfolioId,
        stockId,
        date,
        applicableShares,
        dividendPerShare,
        exchangeRate = 1,
        taxes = 0,
      } = data;
      const holding = await this.getOrCreateHolding(
        portfolioId,
        stockId,
        manager,
      );

      this.invalidateXirrCaches(portfolioId, holding.id);

      const operation = manager.create(PortfolioOperation, {
        type: OperationType.DIVIDEND,
        date: new Date(date),
        holdingId: holding.id,
        applicableShares: String(applicableShares),
        dividendPerShare: String(dividendPerShare),
        exchangeRate: String(exchangeRate),
        taxes: String(taxes),
      });

      // Calculate dividend taxes and apply effects to the holding and operation.
      await this.applyDividendOperation(holding, operation);

      // Now save the operation, which includes the calculated taxes.
      await manager.save(operation);
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
  ): Promise<PortfolioOperation | null> {
    return this.dataSource.transaction(async (manager) => {
      const { portfolioId, stockId, date, splitRatio } = data;

      // First, try to FIND the holding. Do NOT create it implicitly for a split.
      const holding = await this.findPortfolioHolding(
        portfolioId,
        stockId,
        manager,
      );

      if (!holding) {
        // Edge case: No holding exists for this stock in this portfolio.
        // In this case, do NOT create the holding and do NOT apply the split.
        this.logger.warn(
          `Skipping stock split operation for stock ID "${stockId}" in portfolio "${portfolioId}" because no existing holding was found.`,
        );
        return null; // Holding is not created, operation is not applied/recorded.
      }

      // If a holding *does* exist, then check its current shares.
      const currentShares = Number(holding.shares);

      if (isEffectivelyZero(currentShares)) {
        // Holding exists but has effectively zero shares.
        // As per requirement, do NOT apply the split and do NOT record the operation.
        this.logger.warn(
          `Skipping stock split for holding ${holding.id} (ISIN: ${holding.stockMetadata?.isin}) because shares are effectively zero (${currentShares}).`,
        );
        return null;
      }

      // --- Idempotency Check ---
      // Check if a split operation for this holding on this exact date already exists.
      const existingOperation = await manager.findOne(PortfolioOperation, {
        where: {
          holdingId: holding.id,
          type: OperationType.STOCK_SPLIT,
          date: new Date(date),
        },
      });

      if (existingOperation) {
        // The operation already exists, so we can just return it without doing anything.
        // This makes the operation safe to call multiple times with the same data.
        this.logger.log(
          `Existing stock split operation found for holding ${holding.id} on ${date}. Returning existing.`,
        );
        return existingOperation;
      }

      // If we reach here, a holding exists with non-zero shares, and no duplicate split operation exists.
      this.invalidateXirrCaches(portfolioId, holding.id);

      const operation = manager.create(PortfolioOperation, {
        type: OperationType.STOCK_SPLIT,
        date: new Date(date),
        holdingId: holding.id,
        splitRatio: String(splitRatio),
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
    const { numberOfShares, pricePerShare, fees = "0" } = operation;

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
    holding.fees = String(Number(holding.fees) + Number(fees));

    this.updateAggregatesFromInventory(holding);
  }

  private async applySellOperation(
    holding: PortfolioHolding,
    operation: PortfolioOperation,
    manager: EntityManager,
  ): Promise<void> {
    const { numberOfShares, pricePerShare, fees: sellFees = "0" } = operation;

    if (numberOfShares == null || pricePerShare == null) {
      // should not happen due to validation in the controller
      throw new Error(
        "Number of Shares and Price per Share are required for a sell operation",
      );
    }

    const buyTxRepo = manager.getRepository(PortfolioBuyTransaction);

    let sharesToSell = Number(numberOfShares);

    if (sharesToSell - Number(holding.shares) > FLOATING_POINT_TOLERANCE) {
      throw new Error(
        `Cannot sell more shares than are currently in this portfolio holding`,
      );
    }

    let costBasisOfSoldShares = 0;
    const transactionsToDelete: PortfolioBuyTransaction[] = [];
    const transactionsToUpdate: PortfolioBuyTransaction[] = [];

    // Ensure buy transactions are sorted by date for correct FIFO calculation.
    holding.buyTransactions.sort(
      (a, b) => a.transactionDate.getTime() - b.transactionDate.getTime(),
    );

    for (const buyTx of holding.buyTransactions) {
      if (isEffectivelyZero(sharesToSell)) {
        break;
      }

      const sharesSoldFromTx = Math.min(sharesToSell, Number(buyTx.shares));

      // Calculate the prorated fee for the shares being sold from this specific buy transaction.
      const buyFeeForLot =
        Number(buyTx.fees) * (sharesSoldFromTx / Number(buyTx.originalShares));

      // The cost basis for this portion of the sale includes the share price and the prorated fee.
      costBasisOfSoldShares +=
        sharesSoldFromTx * Number(buyTx.pricePerShare) + buyFeeForLot;

      buyTx.shares = String(Number(buyTx.shares) - sharesSoldFromTx);

      if (isEffectivelyZero(Number(buyTx.shares))) {
        transactionsToDelete.push(buyTx);
      } else {
        transactionsToUpdate.push(buyTx);
      }

      sharesToSell -= sharesSoldFromTx;
    }

    // Total proceeds are the sale value minus the fees for this sale.
    const saleProceeds =
      Number(numberOfShares) * Number(pricePerShare) - Number(sellFees);

    // The net realized gain for this specific sale.
    const realizedGainForThisSale = saleProceeds - costBasisOfSoldShares;

    // Calculate taxes on the gain.
    const taxesForThisSale =
      this.taxCalculationService.calculateCapitalGainsTax(
        realizedGainForThisSale,
      );

    // Update the operation with the calculated tax.
    operation.taxes = String(taxesForThisSale);

    holding.realizedGains = String(
      Number(holding.realizedGains) + realizedGainForThisSale,
    );
    holding.fees = String(Number(holding.fees) + Number(sellFees));
    holding.salesTaxes = String(Number(holding.salesTaxes) + taxesForThisSale);

    await buyTxRepo.save(transactionsToUpdate);
    await buyTxRepo.remove(transactionsToDelete);

    holding.buyTransactions = holding.buyTransactions.filter(
      (tx) => !isEffectivelyZero(Number(tx.shares)),
    );

    this.updateAggregatesFromInventory(holding);
  }

  private async applyDividendOperation(
    holding: PortfolioHolding,
    operation: PortfolioOperation,
  ): Promise<void> {
    const { dividendPerShare, applicableShares, exchangeRate = 1 } = operation;

    if (dividendPerShare == null || applicableShares == null) {
      // should not happen due to validation in the controller
      throw new Error(
        "Dividend per Share and Number of Applicable Shares are required for a dividend operation",
      );
    }

    if (!holding.stockMetadata.country) {
      throw new Error(
        `Country data for stock ${holding.stockMetadata.isin} is not loaded. Cannot calculate dividend tax.`,
      );
    }

    const grossDividendInEUR =
      (Number(dividendPerShare) * Number(applicableShares)) /
      Number(exchangeRate);

    const taxes = this.taxCalculationService.calculateDividendTaxes(
      grossDividendInEUR,
      Number(holding.stockMetadata.country.withholdingTaxRate),
    );

    // Update the operation with the calculated tax before it's saved.
    operation.taxes = String(taxes);

    holding.dividends = String(Number(holding.dividends) + grossDividendInEUR);
    holding.totalDividendTaxes = String(
      Number(holding.totalDividendTaxes) + taxes,
    );
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
      tx.shares = String(Number(tx.shares) * Number(splitRatio));
      tx.originalShares = String(
        Number(tx.originalShares) * Number(splitRatio),
      );
      tx.pricePerShare = String(Number(tx.pricePerShare) / Number(splitRatio));
    }

    await buyTxRepo.save(holding.buyTransactions);
    this.updateAggregatesFromInventory(holding);
  }

  private async findPortfolioHolding(
    portfolioId: string,
    stockId: string,
    manager: EntityManager,
  ): Promise<PortfolioHolding | null> {
    const holdingRepo = manager.getRepository(PortfolioHolding);
    return holdingRepo.findOne({
      where: { stockId, portfolioId },
      // Ensure relations needed for current shares calculation or display are loaded
      relations: ["stockMetadata"],
    });
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
      relations: ["country"],
    });

    if (!stock) {
      throw new NotFoundException(`Stock with ID "${stockId}" not found`);
    }

    const holdingRepo = manager.getRepository(PortfolioHolding);

    let holding = await holdingRepo.findOne({
      where: { stockId, portfolioId },
      relations: ["buyTransactions", "stockMetadata", "stockMetadata.country"],
    });

    if (!holding) {
      holding = holdingRepo.create({
        portfolioId,
        portfolio,
        stockId,
        stockMetadata: stock,
        shares: "0", // New holdings start with 0 shares implicitly
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

    holding.shares = String(totalShares);
    holding.totalCostBasis = String(totalCostBasis);
    holding.averagePricePerShare = String(
      isEffectivelyZero(totalShares) ? 0 : totalCostBasis / totalShares,
    );
  }

  /**
   * Helper to invalidate relevant XIRR and asset allocation caches.
   *
   * @param portfolioId The portfolio ID.
   * @param holdingId The holding ID (optional).
   */
  private async invalidateXirrCaches(portfolioId: string, holdingId?: string) {
    if (holdingId) {
      // Use the utility function for invalidation
      const holdingCacheKey = generateHoldingXirrKey(portfolioId, holdingId);
      await this.cacheManager.del(holdingCacheKey);
      this.logger.debug(`Invalidated holding XIRR cache: ${holdingCacheKey}`);
    }

    const holdingListXirrAllCacheKey = generateHoldingListXirrKey(
      portfolioId,
      "all",
    );
    const holdingListXirrActiveCacheKey = generateHoldingListXirrKey(
      portfolioId,
      "active",
    );

    await this.cacheManager.del(holdingListXirrAllCacheKey);
    await this.cacheManager.del(holdingListXirrActiveCacheKey);
    this.logger.debug(
      `Invalidated holding list XIRR caches: ${holdingListXirrAllCacheKey}, ${holdingListXirrActiveCacheKey}`,
    );

    const portfolioAllCacheKey = generatePortfolioXirrKey(portfolioId, "all");
    const portfolioActiveCacheKey = generatePortfolioXirrKey(
      portfolioId,
      "active",
    );

    await this.cacheManager.del(portfolioAllCacheKey);
    await this.cacheManager.del(portfolioActiveCacheKey);
    this.logger.debug(
      `Invalidated portfolio XIRR caches: ${portfolioAllCacheKey}, ${portfolioActiveCacheKey}`,
    );

    const portfolioAllocationCacheKey =
      generatePortfolioAllocationKey(portfolioId);
    await this.cacheManager.del(portfolioAllocationCacheKey);
    this.logger.debug(
      `Invalidated portfolio allocation cache: ${portfolioAllocationCacheKey}`,
    );
  }
}
