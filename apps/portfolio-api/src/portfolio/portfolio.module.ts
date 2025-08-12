import { PortfolioDataAccessModule } from "@codescape-financial/portfolio-data-access";
import { Module } from "@nestjs/common";
import { PortfolioHoldingModule } from "./portfolio-holding";
import { PortfolioController } from "./portfolio.controller";

@Module({
  imports: [PortfolioDataAccessModule, PortfolioHoldingModule],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
