import { PortfolioDataAccessModule } from "@codescape-financial/portfolio-data-access";
import { Module } from "@nestjs/common";
import { PortfolioHoldingController } from "./portfolio-holding.controller";

@Module({
  imports: [PortfolioDataAccessModule],
  controllers: [PortfolioHoldingController],
})
export class PortfolioHoldingModule {}
