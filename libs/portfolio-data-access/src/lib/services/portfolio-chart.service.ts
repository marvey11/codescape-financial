import { formatNormalizedDate, getDateObject } from "@codescape-financial/core";
import { HistoricalQuoteService } from "@codescape-financial/historical-data-access";
import {
  AllocationResponseDTO,
  AssetAllocationDTO,
  CountryAllocationDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PortfolioHolding } from "../entities";

@Injectable()
export class PortfolioChartService {
  private readonly logger = new Logger(PortfolioChartService.name);

  constructor(
    @InjectRepository(PortfolioHolding)
    private readonly holdingRepository: Repository<PortfolioHolding>,
    private readonly historicalQuoteService: HistoricalQuoteService,
  ) {}

  async getAllocationChartData(
    portfolioId: string,
  ): Promise<AllocationResponseDTO> {
    const date = getDateObject(new Date());

    const holdings = await this.holdingRepository.find({
      where: { portfolioId },
      relations: ["stockMetadata", "stockMetadata.country"],
    });

    const activeHoldings = holdings.filter(
      (h) => h.shares && Number(h.shares) > 0,
    );

    if (activeHoldings.length === 0) {
      return {
        portfolioId,
        date: formatNormalizedDate(date),
        assetAllocation: [],
        countryAllocation: [],
      };
    }

    const isins = activeHoldings.map((h) => h.stockMetadata.isin);
    const latestQuotes =
      await this.historicalQuoteService.findLatestByIsins(isins);

    let totalPortfolioValue = 0;
    const assetAllocationMap = new Map<string, AssetAllocationDTO>();
    const countryAllocationMap = new Map<string, CountryAllocationDTO>();

    for (const holding of activeHoldings) {
      const quote = latestQuotes[holding.stockMetadata.isin];
      if (!quote) {
        this.logger.warn(
          `No quote found for ISIN ${holding.stockMetadata.isin} on ${date}. Skipping holding from allocation.`,
        );
        continue;
      }

      const marketValue = Number(holding.shares) * quote.price;
      totalPortfolioValue += marketValue;

      // Asset Allocation
      const assetDto: AssetAllocationDTO = {
        isin: holding.stockMetadata.isin,
        name: holding.stockMetadata.name,
        value: marketValue,
        percentage: 0, // Will be calculated later
      };
      assetAllocationMap.set(holding.stockMetadata.isin, assetDto);

      // Country Allocation
      const countryCode = holding.stockMetadata.country?.isoCode;
      if (countryCode) {
        const countryDto =
          countryAllocationMap.get(countryCode) ??
          ({
            countryCode,
            name: holding.stockMetadata.country.name,
            value: 0,
            percentage: 0,
          } satisfies CountryAllocationDTO);
        countryDto.value += marketValue;
        countryAllocationMap.set(countryCode, countryDto);
      } else {
        this.logger.warn(
          `Country not found for stock ${holding.stockMetadata.isin}. Skipping country allocation for this holding.`,
        );
      }
    }

    // Calculate percentages
    const assetAllocation = Array.from(assetAllocationMap.values()).map(
      (a) => ({
        ...a,
        percentage: totalPortfolioValue > 0 ? a.value / totalPortfolioValue : 0,
      }),
    );

    const countryAllocation = Array.from(countryAllocationMap.values()).map(
      (c) => ({
        ...c,
        percentage: totalPortfolioValue > 0 ? c.value / totalPortfolioValue : 0,
      }),
    );

    return {
      portfolioId,
      date: formatNormalizedDate(date),
      assetAllocation: assetAllocation.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
      countryAllocation: countryAllocation.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    };
  }
}
