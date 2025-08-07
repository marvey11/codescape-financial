import {
  ConfigService,
  SharedConfigModule,
} from "@codescape-financial/portfolio-config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as path from "path";
import { CountryModule } from "../country/index";
import { HistoricalQuoteModule } from "../historical-quote/index";
import { PortfolioOperationModule } from "../portfolio-operation/index";
import { PortfolioModule } from "../portfolio/index";
import { StockMetadataModule } from "../stock-metadata/index";

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
        synchronize: false, // Set to false because we are using migrations
        logging: true,
        // Point to the location of your migration files.
        // The path is relative to the final `main.js` in the `dist` folder.
        migrations: [path.join(__dirname, "migrations", "*.js")],
        // Migrations are not run automatically on startup.
        // They should be run explicitly via the `yarn migration:run` script.
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    CountryModule,
    HistoricalQuoteModule,
    PortfolioModule,
    PortfolioOperationModule,
    StockMetadataModule,
  ],
})
export class AppModule {}
