import config from "config";
import { DataSource } from "typeorm";
import { QuoteData, SecuritiesAccount, SecuritiesExchange, Security, Transaction } from "./entities";

export const AppDataSource = new DataSource({
  ...config.get("database"),
  synchronize: true,
  logging: false,
  entities: [QuoteData, SecuritiesAccount, SecuritiesExchange, Security, Transaction]
});
