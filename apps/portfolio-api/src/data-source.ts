import {
  ConfigService,
  SharedConfigModule,
} from "@codescape-financial/portfolio-config";
import { NestFactory } from "@nestjs/core";
import * as path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";

// This is an IIFE (Immediately Invoked Function Expression) to handle the async setup.
const createDataSource = async (): Promise<DataSource> => {
  // Create a standalone application context to access the ConfigService
  const appContext =
    await NestFactory.createApplicationContext(SharedConfigModule);
  const configService = appContext.get(ConfigService);

  const dataSource = new DataSource({
    type: "postgres",
    host: configService.getDatabaseHost(),
    port: configService.getDatabasePort(),
    username: configService.getDatabaseUser(),
    password: configService.getDatabasePassword(),
    database: configService.getDatabaseName(),
    synchronize: false,
    logging: false,
    entities: [path.join(process.cwd(), "libs/**/*.entity.{ts,js}")],
    migrations: [
      path.join(process.cwd(), "apps/portfolio-api/src/migrations/*.{ts,js}"),
    ],
    subscribers: [],
  });

  await appContext.close();
  return dataSource;
};

export const AppDataSource = createDataSource();
