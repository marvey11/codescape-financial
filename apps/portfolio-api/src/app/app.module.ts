import {
  Country,
  HistoricalQuote,
  StockMetadata,
} from "@codescape-financial/portfolio-data-access";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CountryModule } from "../country";
import { HistoricalQuoteModule } from "../historical-quote";
import { StockMetadataModule } from "../stock-metadata";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "codescape",
      password: "password",
      database: "codescape-financial",
      entities: [Country, HistoricalQuote, StockMetadata],
      synchronize: true, // For development only
      logging: true,
    }),
    CountryModule,
    HistoricalQuoteModule,
    StockMetadataModule,
  ],
})
export class AppModule {}
