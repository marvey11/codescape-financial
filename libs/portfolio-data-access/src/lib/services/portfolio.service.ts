import { FLOATING_POINT_TOLERANCE } from "@codescape-financial/core";
import {
  CreatePortfolioDTO,
  PortfolioResponseDTO,
  UpdatePortfolioDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Portfolio } from "../entities";

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async findAll(): Promise<PortfolioResponseDTO[]> {
    const portfolios = await this.portfolioRepository
      .createQueryBuilder("portfolio")
      .leftJoinAndSelect(
        "portfolio.holdings",
        "holding",
        "holding.shares > :minShares",
        { minShares: FLOATING_POINT_TOLERANCE },
      )
      .leftJoinAndSelect("holding.stockMetadata", "stockMetadata")
      .getMany();

    return portfolios.map(this.mapEntityToDto);
  }

  async findOne(portfolioId: string): Promise<PortfolioResponseDTO> {
    const portfolio = await this.portfolioRepository
      .createQueryBuilder("portfolio")
      .leftJoinAndSelect(
        "portfolio.holdings",
        "holding",
        "holding.shares > :minShares",
        { minShares: FLOATING_POINT_TOLERANCE },
      )
      .leftJoinAndSelect("holding.stockMetadata", "stockMetadata")
      .where("portfolio.id = :portfolioId", { portfolioId })
      .getOne();

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

    // Sum up the values from all holdings using `reduce` for better performance and clarity.
    // This avoids repeated string-to-number conversions inside a loop.
    portfolio.totalCostBasis = String(
      portfolio.holdings.reduce((sum, h) => sum + Number(h.totalCostBasis), 0),
    );
    portfolio.totalFees = String(
      portfolio.holdings.reduce((sum, h) => sum + Number(h.fees), 0),
    );
    portfolio.totalRealizedGains = String(
      portfolio.holdings.reduce((sum, h) => sum + Number(h.realizedGains), 0),
    );
    portfolio.totalSalesTaxes = String(
      portfolio.holdings.reduce((sum, h) => sum + Number(h.salesTaxes), 0),
    );
    portfolio.totalDividends = String(
      portfolio.holdings.reduce((sum, h) => sum + Number(h.dividends), 0),
    );
    portfolio.totalDividendTaxes = String(
      portfolio.holdings.reduce(
        (sum, h) => sum + Number(h.totalDividendTaxes),
        0,
      ),
    );

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
        totalCostBasis: Number(totalCostBasis),
        totalFees: Number(totalFees),
        totalRealizedGains: Number(totalRealizedGains),
        totalTaxFromSoldShares: Number(totalSalesTaxes),
        totalDividends: Number(totalDividends),
        totalTaxFromDividends: Number(totalDividendTaxes),
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
          averagePricePerShare: Number(holding.averagePricePerShare),
          totalShares: Number(holding.shares),
          totalCostBasis: Number(holding.totalCostBasis),
          totalFees: Number(holding.fees),
          totalRealizedGains: Number(holding.realizedGains),
          totalTaxFromSoldShares: Number(holding.salesTaxes),
          totalDividends: Number(holding.dividends),
          totalTaxFromDividends: Number(holding.totalDividendTaxes),
        },
      })),
    } satisfies PortfolioResponseDTO;
  }
}
