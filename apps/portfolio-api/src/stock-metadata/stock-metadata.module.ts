import { HistoricalQuotesDataAccessModule } from "@codescape-financial/portfolio-data-access";
import { Module } from "@nestjs/common";
import { StockMetadataController } from "./stock-metadata.controller.js";
import { StockMetadataService } from "./stock-metadata.service.js";

@Module({
  imports: [HistoricalQuotesDataAccessModule],
  controllers: [StockMetadataController],
  providers: [StockMetadataService],
})
export class StockMetadataModule {}
