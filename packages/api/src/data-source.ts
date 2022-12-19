import config from "config";
import { DataSource } from "typeorm";
import { SecuritiesExchange, Security } from "./entities";

export const AppDataSource = new DataSource({
  ...config.get("database"),
  synchronize: true,
  logging: false,
  entities: [Security, SecuritiesExchange]
});
