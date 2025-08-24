import {
  PortfolioCalculationService,
  PortfolioHoldingService,
} from "@codescape-financial/portfolio-data-access";
import {
  PortfolioViewFilterDTO,
  XIRRHoldingListResponseDTO,
  XIRRHoldingResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("portfolios/:portfolioId/holdings")
export class PortfolioHoldingController {
  constructor(
    private readonly portfolioHoldingService: PortfolioHoldingService,
    private readonly portfolioCalculationService: PortfolioCalculationService,
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
    return this.portfolioCalculationService.calculateXIRRForHoldingListWithCache(
      portfolioId,
      filter.viewType ?? "all",
    );
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
    return this.portfolioCalculationService.calculateXIRRForHoldingWithCache(
      portfolioId,
      holdingId,
    );
  }
}
