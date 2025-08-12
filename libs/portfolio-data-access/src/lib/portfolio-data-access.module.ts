import { HistoricalDataAccessModule } from "@codescape-financial/historical-data-access";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Portfolio,
  PortfolioBuyTransaction,
  PortfolioHolding,
  PortfolioOperation,
} from "./entities";
import {
  PortfolioHoldingService,
  PortfolioOperationService,
  PortfolioService,
  TaxCalculationService,
  XIRRCalculationService,
} from "./services";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portfolio,
      PortfolioBuyTransaction,
      PortfolioHolding,
      PortfolioOperation,
    ]),
    HistoricalDataAccessModule,
  ],
  providers: [
    PortfolioHoldingService,
    PortfolioOperationService,
    PortfolioService,
    TaxCalculationService,
    XIRRCalculationService,
  ],
  exports: [
    PortfolioHoldingService,
    PortfolioOperationService,
    PortfolioService,
    TaxCalculationService,
    TypeOrmModule,
    XIRRCalculationService,
  ],
})
export class PortfolioDataAccessModule {}
