import { HistoricalDataAccessModule } from "@codescape-financial/historical-data-access";
import { Module } from "@nestjs/common";
import { HistoricalQuoteController } from "./historical-quote.controller.js";

@Module({
  imports: [HistoricalDataAccessModule],
  controllers: [HistoricalQuoteController],
})
export class HistoricalQuoteModule {}
