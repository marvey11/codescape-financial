import { generatePortfolioXirrKey } from "@codescape-financial/core";
import {
  PortfolioCalculationService,
  PortfolioService,
} from "@codescape-financial/portfolio-data-access";
import {
  CreatePortfolioDTO,
  PortfolioViewFilterDTO,
  UpdatePortfolioDTO,
  XIRRPortfolioResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import type { Cache } from "cache-manager";

const TTL_MILLISECONDS = 60 * 60 * 1000;

@Controller("portfolios")
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly portfolioCalculationService: PortfolioCalculationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Inject the Cache Manager
  ) {}

  @Get()
  async getAll() {
    return this.portfolioService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.portfolioService.findOne(id);
  }

  @Post()
  async createPortfolio(@Body() dto: CreatePortfolioDTO) {
    return this.portfolioService.create(dto);
  }

  @Put(":id")
  async updatePortfolio(
    @Param("id") id: string,
    @Body() dto: UpdatePortfolioDTO,
  ) {
    return this.portfolioService.update(id, dto);
  }

  @Delete(":id")
  async deletePortfolio(@Param("id") id: string) {
    return this.portfolioService.remove(id);
  }

  @Get(":id/xirr")
  async getPortfolioXirr(
    @Param("id") portfolioId: string,
    @Query() filter: PortfolioViewFilterDTO,
  ): Promise<XIRRPortfolioResponseDTO | null> {
    const cacheKey = generatePortfolioXirrKey(
      portfolioId,
      filter.viewType ?? "all",
    );

    // Attempt to retrieve from cache
    const cachedXIRR =
      await this.cacheManager.get<XIRRPortfolioResponseDTO>(cacheKey);
    if (cachedXIRR) {
      return cachedXIRR;
    }

    const xirrResult =
      this.portfolioCalculationService.calculateXIRRForPortfolio(
        portfolioId,
        filter.viewType ?? "all",
      );

    await this.cacheManager.set(cacheKey, xirrResult, TTL_MILLISECONDS);

    return xirrResult;
  }
}
