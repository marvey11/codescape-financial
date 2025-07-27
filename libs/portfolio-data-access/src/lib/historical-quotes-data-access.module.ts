// libs/historical-quotes/data-access/src/lib/historical-quotes-data-access.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Country, HistoricalQuote, StockMetadata } from "./entities/index.js";
import { HistoricalQuoteService } from "./services/historical-quote.service.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoricalQuote, StockMetadata, Country]),
  ],
  providers: [HistoricalQuoteService],
  exports: [HistoricalQuoteService, TypeOrmModule],
})
export class HistoricalQuotesDataAccessModule {}
