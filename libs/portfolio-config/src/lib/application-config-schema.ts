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

  BASE_DATA_DIR: z.string().min(1).default("./data"),

  QUOTES_DATA_DIR: z.string().min(1).default("./data/quotes"),
  QUOTES_PROCESSED_DIR: z.string().min(1),
  QUOTES_ERRORS_DIR: z.string().min(1),

  DEFAULT_PORTFOLIO_ID: z.uuid(),

  PORTFOLIO_DATA_DIR: z.string().min(1).default("./data/portfolio"),
  CSV_TRANSACTIONS_INPUT_DIR: z.string().min(1),
  JSON_DIVIDENDS_INPUT_FILE: z.string().min(1),
  JSON_STOCK_SPLITS_INPUT_FILE: z.string().min(1),
});

type ApplicationConfigData = z.infer<typeof ApplicationConfigSchema>;

export { ApplicationConfigSchema };
export type { ApplicationConfigData };
