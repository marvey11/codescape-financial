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
          validationSchema: ApplicationConfigSchema,
          validate: ApplicationConfigSchema.parse,
          validationOptions: {
            allowUnknown: true,
            abortEarly: false,
          },
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

  describe("Test Suite for CSV processor configuration", () => {
    it("should have the correct base directory for CSV files", () => {
      expect(service.get("CSV_RAW_DATA_INPUT_DIR")).toBe(
        "./test_data/csv_uploads"
      );
    });

    it("should return the CSV quotes directory from config", () => {
      // This test now also verifies the `expandVariables` functionality
      expect(service.getCSVQuotesDir()).toBe("./test_data/csv_uploads/quotes");
    });

    it("should return the processed CSV quotes directory from config", () => {
      // This test now also verifies the `expandVariables` functionality
      expect(service.getCSVQuotesProcessedDir()).toBe(
        // This now reads from the .env.test file
        "./test_data/csv_uploads/quotes/processed"
      );
    });

    it("should return the CSV quote errors directory from config", () => {
      // This test now also verifies the `expandVariables` functionality
      expect(service.getCSVQuoteErrorsDir()).toBe(
        "./test_data/csv_uploads/quotes/errors"
      );
    });

    it("should return the CSV transactions directory from config", () => {
      expect(service.getCSVTransactionsDir()).toBe(
        "./test_data/csv_uploads/transactions"
      );
    });

    it("should return the processed CSV transactions directory from config", () => {
      expect(service.getCSVTransactionsProcessedDir()).toBe(
        "./test_data/csv_uploads/transactions/processed"
      );
    });

    it("should return the CSV transaction errors directory from config", () => {
      expect(service.getCSVTransactionErrorsDir()).toBe(
        "./test_data/csv_uploads/transactions/errors"
      );
    });
  });
});
