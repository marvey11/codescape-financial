import { HistoricalDataAccessModule } from "@codescape-financial/historical-data-access";
import { Module } from "@nestjs/common";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";

@Module({
  imports: [HistoricalDataAccessModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
