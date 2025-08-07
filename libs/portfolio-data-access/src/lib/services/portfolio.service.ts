import {
  CreatePortfolioDTO,
  PortfolioResponseDTO,
  UpdatePortfolioDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Portfolio } from "../entities/index";

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async findAll(): Promise<PortfolioResponseDTO[]> {
    return this.portfolioRepository
      .find({ relations: ["holdings", "holdings.stockMetadata"] })
      .then((portfolios) => portfolios.map(this.mapEntityToDto));
  }

  async findOne(portfolioId: string): Promise<PortfolioResponseDTO> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
      relations: ["holdings", "holdings.stockMetadata"],
    });

    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio with ID "${portfolioId}" not found`,
      );
    }

    return this.mapEntityToDto(portfolio);
  }

  async create(dto: CreatePortfolioDTO): Promise<PortfolioResponseDTO> {
    const portfolio = this.portfolioRepository.create(dto);
    return this.portfolioRepository.save(portfolio).then(this.mapEntityToDto);
  }

  async update(
    portfolioId: string,
    dto: UpdatePortfolioDTO,
  ): Promise<PortfolioResponseDTO> {
    const portfolioToUpdate = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
      relations: ["holdings", "holdings.stockMetadata"],
    });

    if (!portfolioToUpdate) {
      throw new NotFoundException(
        `Portfolio with ID "${portfolioId}" not found`,
      );
    }

    this.portfolioRepository.merge(portfolioToUpdate, dto);

    return this.portfolioRepository
      .save(portfolioToUpdate)
      .then(this.mapEntityToDto);
  }

  async remove(id: string): Promise<void> {
    await this.portfolioRepository.delete(id);
  }

  /**
   * Recalculates and updates the aggregate values for a specific portfolio.
   * This should be called within a transaction whenever a holding is modified.
   *
   * @param portfolioId The ID of the portfolio to update.
   * @param manager The EntityManager to use for the transaction.
   */
  async updatePortfolioAggregates(
    portfolioId: string,
    manager: EntityManager,
  ): Promise<void> {
    const portfolio = await manager.findOne(Portfolio, {
      where: { id: portfolioId },
      relations: ["holdings", "holdings.stockMetadata"],
    });

    if (!portfolio) {
      // This should not happen if called from a valid operation, but it's a good safeguard.
      throw new NotFoundException(
        `Portfolio with ID "${portfolioId}" not found during aggregate update.`,
      );
    }

    // Reset aggregates to 0 before recalculating
    portfolio.totalCostBasis = 0;
    portfolio.totalFees = 0;
    portfolio.totalRealizedGains = 0;
    portfolio.totalSalesTaxes = 0;
    portfolio.totalDividends = 0;
    portfolio.totalDividendTaxes = 0;

    // Sum up the values from all holdings
    for (const holding of portfolio.holdings) {
      portfolio.totalCostBasis += Number(holding.totalCostBasis);
      portfolio.totalFees += Number(holding.fees);
      portfolio.totalRealizedGains += Number(holding.realizedGains);
      portfolio.totalSalesTaxes += Number(holding.salesTaxes);
      portfolio.totalDividends += Number(holding.dividends);
      portfolio.totalDividendTaxes += Number(holding.totalDividendTaxes);
    }

    await manager.save(portfolio);
  }

  private mapEntityToDto(portfolio: Portfolio): PortfolioResponseDTO {
    const {
      id,
      name,
      description,
      totalCostBasis,
      totalFees,
      totalRealizedGains,
      totalSalesTaxes,
      totalDividends,
      totalDividendTaxes,
    } = portfolio;
    return {
      id,
      name,
      description,
      summary: {
        totalCostBasis,
        totalFees,
        totalRealizedGains,
        totalTaxFromSoldShares: totalSalesTaxes,
        totalDividends,
        totalTaxFromDividends: totalDividendTaxes,
      },
      holdings: portfolio.holdings.map((holding) => ({
        id: holding.id,
        stock: {
          id: holding.stockId,
          isin: holding.stockMetadata.isin,
          nsin: holding.stockMetadata.nsin,
          name: holding.stockMetadata.name,
        },
        summary: {
          averagePricePerShare: holding.averagePricePerShare,
          totalShares: holding.shares,
          totalCostBasis: holding.totalCostBasis,
          totalFees: holding.fees,
          totalRealizedGains: holding.realizedGains,
          totalTaxFromSoldShares: holding.salesTaxes,
          totalDividends: holding.dividends,
          totalTaxFromDividends: holding.totalDividendTaxes,
        },
      })),
    } satisfies PortfolioResponseDTO;
  }
}
