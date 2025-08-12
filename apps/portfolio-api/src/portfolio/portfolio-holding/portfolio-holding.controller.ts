import {
  PortfolioHoldingService,
  PortfolioOperationService,
} from "@codescape-financial/portfolio-data-access";
import { Controller, Get, Param } from "@nestjs/common";

@Controller("portfolios/:portfolioId/holdings")
export class PortfolioHoldingController {
  constructor(
    private readonly portfolioHoldingService: PortfolioHoldingService,
    private readonly portfolioOperationService: PortfolioOperationService,
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
  ) {
    return this.portfolioOperationService.calculateXIRRForHolding(
      portfolioId,
      holdingId,
    );
  }
}
