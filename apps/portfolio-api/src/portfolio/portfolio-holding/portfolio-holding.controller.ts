import {
  PortfolioCalculationService,
  PortfolioHoldingService,
} from "@codescape-financial/portfolio-data-access";
import {
  BatchISINRequestDTO,
  XIRRHoldingBatchResponseDTO,
  XIRRHoldingResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";

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
    return this.portfolioCalculationService.calculateXIRRForHolding(
      portfolioId,
      holdingId,
    );
  }

  @Post("xirr-batch")
  async batchGetHoldingXIRR(
    @Param("portfolioId") portfolioId: string,
    @Body() body: BatchISINRequestDTO,
  ): Promise<XIRRHoldingBatchResponseDTO> {
    return this.portfolioCalculationService.calculateBatchXIRRForHoldings(
      portfolioId,
      body.isins,
    );
  }
}
