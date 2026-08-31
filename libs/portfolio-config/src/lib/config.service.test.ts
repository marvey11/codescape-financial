import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { ApplicationConfigSchema } from "./application-config-schema";
import { ConfigService } from "./config.service";

describe("ConfigService", () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestConfigModule.forRoot({
          // Load variables from the .env.test file located in this library's root.
          // This is more robust than using the `load` option.
          envFilePath: ".env.test",
          isGlobal: true,
          validate: (config) => ApplicationConfigSchema.parse(config),
          expandVariables: true,
        }),
      ],
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Test Suite for REST API configuration", () => {
    it("should return the API port from config", () => {
      expect(service.getApiPort()).toBe(4000);
    });

    it("should return the API prefix from config", () => {
      expect(service.getApiPrefix()).toBe("test-api");
    });
  });

  describe("Test Suite for database configuration", () => {
    it("should return the database host from config", () => {
      expect(service.getDatabaseHost()).toBe("test-db-host");
    });

    it("should return the database port from config", () => {
      expect(service.getDatabasePort()).toBe(5433);
    });

    it("should return the database name from config", () => {
      expect(service.getDatabaseName()).toBe("test_db_name");
    });

    it("should return the database user from config", () => {
      expect(service.getDatabaseUser()).toBe("test_user");
    });

    it("should return the database password from config", () => {
      expect(service.getDatabasePassword()).toBe("test_password");
    });
  });

  describe("Test Suite for quotes data processor configuration", () => {
    it("should have the correct base directory for data files", () => {
      expect(service.getQuotesDataDir()).toBe("./test_data/quotes");
    });

    it("should have the correct directory for input/processed/error data files", () => {
      expect(service.getQuotesProcessedDir()).toBe(
        "./test_data/quotes/processed",
      );
      expect(service.getQuotesErrorsDir()).toBe("./test_data/quotes/errors");
    });
  });

  describe("Test Suite for portfolio data processor configuration", () => {
    it("should return the directories for specific types of data files", () => {
      expect(service.getPortfolioDataDir()).toBe("./test_data/portfolio");
      expect(service.getTransactionsInputDir()).toBe(
        "./test_data/portfolio/transactions",
      );
      expect(service.getStockSplitsInputFile()).toBe(
        "./test_data/portfolio/stock-split-data.json",
      );
      expect(service.getDividendsInputFile()).toBe(
        "./test_data/portfolio/dividend-data.json",
      );
    });
  });
});
