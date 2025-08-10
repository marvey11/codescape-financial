import { PortfolioHoldingService } from "@codescape-financial/portfolio-data-access";
import { PortfolioHoldingBaseDTO } from "@codescape-financial/portfolio-data-models";
import { Controller, Get, Param } from "@nestjs/common";

@Controller("portfolio-holdings")
export class PortfolioHoldingController {
  constructor(
    private readonly portfolioHoldingService: PortfolioHoldingService,
  ) {}

  @Get(":id")
  async getHolding(
    @Param("id") id: string,
  ): Promise<PortfolioHoldingBaseDTO | null> {
    return this.portfolioHoldingService.findOne(id);
  }
}
