import { HistoricalQuotesDataAccessModule } from "@codescape-financial/historical-data-access";
import {
  ConfigService,
  SharedConfigModule,
} from "@codescape-financial/portfolio-config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CsvParserService } from "../csv-parser/index.js";
import { CsvProcessingService } from "../csv-processing/index.js";
import { DataIngestionService } from "../data-ingestion/index.js";

@Module({
  imports: [
    SharedConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.getDatabaseHost(),
        port: configService.getDatabasePort(),
        username: configService.getDatabaseUser(),
        password: configService.getDatabasePassword(),
        database: configService.getDatabaseName(),
        // This option is crucial. It tells TypeORM to automatically load entities
        // that have been registered with `forFeature` in other modules.
        autoLoadEntities: true,
        synchronize: true, // For development only, do not use in production
        logging: true,
      }),
      inject: [ConfigService],
    }),
    HistoricalQuotesDataAccessModule, // <--- Import your new data access module
    // ... other modules
  ],
  controllers: [],
  providers: [CsvProcessingService, CsvParserService, DataIngestionService],
})
export class AppModule {}
