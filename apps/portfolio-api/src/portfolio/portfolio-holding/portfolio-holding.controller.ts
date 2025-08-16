import {
  generateHoldingListXirrKey,
  generateHoldingXirrKey,
} from "@codescape-financial/core";
import {
  PortfolioCalculationService,
  PortfolioHoldingService,
} from "@codescape-financial/portfolio-data-access";
import {
  PortfolioViewFilterDTO,
  XIRRHoldingListResponseDTO,
  XIRRHoldingResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import type { Cache } from "cache-manager";

const TTL_MILLISECONDS = 60 * 60 * 1000;

@Controller("portfolios/:portfolioId/holdings")
export class PortfolioHoldingController {
  constructor(
    private readonly portfolioHoldingService: PortfolioHoldingService,
    private readonly portfolioCalculationService: PortfolioCalculationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Inject the Cache Manager
  ) {}

  @Get()
  async findAllByPortfolio(@Param("portfolioId") portfolioId: string) {
    return this.portfolioHoldingService.findAllByPortfolio(portfolioId);
  }

  @Get("xirr")
  async getHoldingListXIRR(
    @Param("portfolioId") portfolioId: string,
    @Query() filter: PortfolioViewFilterDTO,
  ): Promise<XIRRHoldingListResponseDTO | null> {
    const cacheKey = generateHoldingListXirrKey(
      portfolioId,
      filter.viewType ?? "all",
    );

    // Attempt to retrieve from cache
    const cachedXIRR =
      await this.cacheManager.get<XIRRHoldingListResponseDTO>(cacheKey);
    if (cachedXIRR) {
      return cachedXIRR;
    }

    const xirrResult =
      this.portfolioCalculationService.calculateXIRRForHoldingList(
        portfolioId,
        filter.viewType ?? "all",
      );

    await this.cacheManager.set(cacheKey, xirrResult, TTL_MILLISECONDS);

    return xirrResult;
  }

  @Get(":holdingId")
  async findOne(
    @Param("portfolioId") portfolioId: string,
    @Param("holdingId") holdingId: string,
  ) {
    return this.portfolioHoldingService.findOne(portfolioId, holdingId);
  }

  @Get(":holdingId/xirr")
  async getHoldingXIRR(
    @Param("portfolioId") portfolioId: string,
    @Param("holdingId") holdingId: string,
  ): Promise<XIRRHoldingResponseDTO | null> {
    const cacheKey = generateHoldingXirrKey(portfolioId, holdingId);

    // Attempt to retrieve from cache
    const cachedXIRR =
      await this.cacheManager.get<XIRRHoldingResponseDTO>(cacheKey);
    if (cachedXIRR) {
      return cachedXIRR;
    }

    const xirrResult = this.portfolioCalculationService.calculateXIRRForHolding(
      portfolioId,
      holdingId,
    );

    await this.cacheManager.set(cacheKey, xirrResult, TTL_MILLISECONDS);

    return xirrResult;
  }
}
