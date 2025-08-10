import { HistoricalDataAccessModule } from "@codescape-financial/historical-data-access";
import { Module } from "@nestjs/common";
import { StockMetadataController } from "./stock-metadata.controller";
import { StockMetadataService } from "./stock-metadata.service";

@Module({
  imports: [HistoricalDataAccessModule],
  controllers: [StockMetadataController],
  providers: [StockMetadataService],
})
export class StockMetadataModule {}
