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
  PortfolioCalculationService,
  PortfolioHoldingService,
  PortfolioOperationService,
  PortfolioService,
  TaxCalculationService,
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
    PortfolioCalculationService,
    PortfolioHoldingService,
    PortfolioOperationService,
    PortfolioService,
    TaxCalculationService,
  ],
  exports: [
    PortfolioCalculationService,
    PortfolioHoldingService,
    PortfolioOperationService,
    PortfolioService,
    TaxCalculationService,
    TypeOrmModule,
  ],
})
export class PortfolioDataAccessModule {}
