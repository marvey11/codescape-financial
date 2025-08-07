import { PortfolioDataAccessModule } from "@codescape-financial/portfolio-data-access";
import { Module } from "@nestjs/common";
import { PortfolioOperationController } from "./portfolio-operation.controller";

@Module({
  imports: [PortfolioDataAccessModule],
  controllers: [PortfolioOperationController],
})
export class PortfolioOperationModule {}
