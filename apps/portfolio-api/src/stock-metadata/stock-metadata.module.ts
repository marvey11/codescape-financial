import { HistoricalDataAccessModule } from "@codescape-financial/historical-data-access";
import { Module } from "@nestjs/common";
import { StockMetadataController } from "./stock-metadata.controller.js";
import { StockMetadataService } from "./stock-metadata.service.js";

@Module({
  imports: [HistoricalDataAccessModule],
  controllers: [StockMetadataController],
  providers: [StockMetadataService],
})
export class StockMetadataModule {}
