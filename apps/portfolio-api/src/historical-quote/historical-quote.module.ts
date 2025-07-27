import { HistoricalQuotesDataAccessModule } from "@codescape-financial/portfolio-data-access";
import { Module } from "@nestjs/common";
import { HistoricalQuoteController } from "./historical-quote.controller.js";

@Module({
  imports: [HistoricalQuotesDataAccessModule],
  controllers: [HistoricalQuoteController],
  // providers: [HistoricalQuoteService],
})
export class HistoricalQuoteModule {}
