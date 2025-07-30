import { z } from "zod";

const ApplicationConfigSchema = z.object({
  // REST API backend configuration
  API_PORT: z.coerce.number().positive().optional().default(3000),
  API_PREFIX: z.string().optional().default("api"),

  // Database configuration
  DATABASE_HOST: z.string().min(1).default("localhost"),
  DATABASE_PORT: z.coerce.number().positive().default(5432),
  DATABASE_NAME: z.string().min(1).default("codescape_financial"),
  DATABASE_USER: z.string().min(1).default("codescape"),
  DATABASE_PASSWORD: z.string().min(1),

  // CSV Processor configuration
  CSV_RAW_DATA_INPUT_DIR: z.string().min(1).default("./data/csv_uploads"),

  CSV_QUOTES_DIR: z.string().min(1),
  CSV_QUOTES_PROCESSED_DIR: z.string().min(1),
  CSV_QUOTE_ERRORS_DIR: z.string().min(1), // Renamed from SUBDIR for consistency

  CSV_TRANSACTIONS_DIR: z.string().min(1),
  CSV_TRANSACTIONS_PROCESSED_DIR: z.string().min(1),
  CSV_TRANSACTION_ERRORS_DIR: z.string().min(1),
});

type ApplicationConfigData = z.infer<typeof ApplicationConfigSchema>;

export { ApplicationConfigSchema };
export type { ApplicationConfigData };
