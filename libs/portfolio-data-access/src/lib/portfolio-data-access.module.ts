import { HistoricalDataAccessModule } from "@codescape-financial/historical-data-access";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Portfolio,
  PortfolioBuyTransaction,
  PortfolioHolding,
  PortfolioOperation,
} from "./entities";
import {
  PortfolioCachingService,
  PortfolioCalculationService,
  PortfolioChartService,
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
    CacheModule.register({
      // You don't need `isGlobal: true` here for the register options,
      // as it's typically handled at the application root.
      // But importing it here makes its providers available.
    }),
    HistoricalDataAccessModule,
  ],
  providers: [
    PortfolioCachingService,
    PortfolioCalculationService,
    PortfolioChartService,
    PortfolioHoldingService,
    PortfolioOperationService,
    PortfolioService,
    TaxCalculationService,
  ],
  exports: [
    PortfolioCachingService,
    PortfolioCalculationService,
    PortfolioChartService,
    PortfolioHoldingService,
    PortfolioOperationService,
    PortfolioService,
    TaxCalculationService,
    TypeOrmModule,
  ],
})
export class PortfolioDataAccessModule {}
