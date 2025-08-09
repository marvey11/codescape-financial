import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { ApplicationConfigData } from "./application-config-schema";

@Injectable()
export class ConfigService {
  constructor(
    private nestConfigService: NestConfigService<ApplicationConfigData, true>,
  ) {}

  /**
   * Get a configuration value by key.
   * Provides type safety based on your AppConfig schema.
   *
   * @param key The key of the configuration value.
   * @returns The configuration value.
   */
  get<T extends keyof ApplicationConfigData>(key: T): ApplicationConfigData[T] {
    // The 'true' in NestConfigService<ApplicationConfigData, true> asserts that all keys exist,
    // so we can safely cast here. If a key might be optional, handle it with default values in schema
    // or use nestConfigService.get<ApplicationConfigData[T]>(key, { infer: true })
    return this.nestConfigService.get(key, { infer: true });
  }

  getApiPort(): ApplicationConfigData["API_PORT"] {
    return this.get("API_PORT");
  }

  getApiPrefix(): ApplicationConfigData["API_PREFIX"] {
    return this.get("API_PREFIX");
  }

  getDatabaseHost(): ApplicationConfigData["DATABASE_HOST"] {
    return this.get("DATABASE_HOST");
  }

  getDatabasePort(): ApplicationConfigData["DATABASE_PORT"] {
    return this.get("DATABASE_PORT");
  }

  getDatabaseName(): ApplicationConfigData["DATABASE_NAME"] {
    return this.get("DATABASE_NAME");
  }

  getDatabaseUser(): ApplicationConfigData["DATABASE_USER"] {
    return this.get("DATABASE_USER");
  }

  getDatabasePassword(): ApplicationConfigData["DATABASE_PASSWORD"] {
    return this.get("DATABASE_PASSWORD");
  }

  getQuotesDataDir(): ApplicationConfigData["QUOTES_DATA_DIR"] {
    return this.get("QUOTES_DATA_DIR");
  }

  getQuotesProcessedDir(): ApplicationConfigData["QUOTES_PROCESSED_DIR"] {
    return this.get("QUOTES_PROCESSED_DIR");
  }

  getQuotesErrorsDir(): ApplicationConfigData["QUOTES_ERRORS_DIR"] {
    return this.get("QUOTES_ERRORS_DIR");
  }

  getDefaultPortfolioId(): ApplicationConfigData["DEFAULT_PORTFOLIO_ID"] {
    return this.get("DEFAULT_PORTFOLIO_ID");
  }

  getPortfolioDataDir(): ApplicationConfigData["PORTFOLIO_DATA_DIR"] {
    return this.get("PORTFOLIO_DATA_DIR");
  }

  getTransactionsInputDir(): ApplicationConfigData["CSV_TRANSACTIONS_INPUT_DIR"] {
    return this.get("CSV_TRANSACTIONS_INPUT_DIR");
  }

  getDividendsInputFile(): ApplicationConfigData["JSON_DIVIDENDS_INPUT_FILE"] {
    return this.get("JSON_DIVIDENDS_INPUT_FILE");
  }

  getStockSplitsInputFile(): ApplicationConfigData["JSON_STOCK_SPLITS_INPUT_FILE"] {
    return this.get("JSON_STOCK_SPLITS_INPUT_FILE");
  }
}
