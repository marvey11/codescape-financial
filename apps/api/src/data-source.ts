import { getDatabaseConfig } from "@csfin/core";
import { DataSource, DataSourceOptions } from "typeorm";
import { QuoteData, SecuritiesAccount, SecuritiesExchange, Security, Transaction } from "./entities";

export const AppDataSource = new DataSource({
  ...(getDatabaseConfig() as DataSourceOptions),
  synchronize: true,
  logging: false,
  entities: [QuoteData, SecuritiesAccount, SecuritiesExchange, Security, Transaction]
});
