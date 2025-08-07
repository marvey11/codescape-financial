import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Country, HistoricalQuote, StockMetadata } from "./entities/index";
import { HistoricalQuoteService } from "./services/historical-quote.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoricalQuote, StockMetadata, Country]),
  ],
  providers: [HistoricalQuoteService],
  exports: [HistoricalQuoteService, TypeOrmModule],
})
export class HistoricalDataAccessModule {}
