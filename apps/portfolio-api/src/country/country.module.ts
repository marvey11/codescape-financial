import { HistoricalQuotesDataAccessModule } from "@codescape-financial/historical-data-access";
import { Module } from "@nestjs/common";
import { CountryController } from "./country.controller.js";
import { CountryService } from "./country.service.js";

@Module({
  imports: [HistoricalQuotesDataAccessModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
