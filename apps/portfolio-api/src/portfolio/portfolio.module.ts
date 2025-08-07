import { PortfolioDataAccessModule } from "@codescape-financial/portfolio-data-access";
import { Module } from "@nestjs/common";
import { PortfolioController } from "./portfolio.controller";

@Module({
  imports: [PortfolioDataAccessModule],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
