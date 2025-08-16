import { HistoricalDataAccessModule } from "@codescape-financial/historical-data-access";
import {
  ConfigService,
  SharedConfigModule,
} from "@codescape-financial/portfolio-config";
import { PortfolioDataAccessModule } from "@codescape-financial/portfolio-data-access";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";
import { PortfolioIngestionService } from "../ingest/portfolio-ingestion.service";
import {
  CsvTransactionParserService,
  JsonDividendParserService,
  JsonStockSplitParserService,
} from "../parse";

@Module({
  imports: [
    SharedConfigModule,
    CacheModule.register({
      ttl: 60 * 60 * 1000, // 1 hour in milliseconds
      isGlobal: true, // Making it global is usually the intent for shared services like caching
    }),
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
        synchronize: false, // Set to false because we are using migrations
        logging: true,
        // Point to the location of your migration files.
        // The path is relative to the final `main.js` in the `dist` folder.
        migrations: [
          path.join(__dirname, "..", "portfolio-api", "migrations", "*.js"),
        ],
        // Migrations are not run automatically on startup.
        // They should be run explicitly via the `yarn migration:run` script.
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    HistoricalDataAccessModule,
    PortfolioDataAccessModule,
  ],
  controllers: [],
  providers: [
    CsvTransactionParserService,
    JsonDividendParserService,
    JsonStockSplitParserService,
    PortfolioIngestionService,
  ],
})
export class AppModule {}
