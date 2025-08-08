import { Injectable, Logger } from "@nestjs/common";
import { CsvQuoteParserService } from "../csv-parser/index.js";
import { QuoteDataIngestionService } from "../data-ingestion/index.js";

@Injectable()
export class CsvQuoteProcessingService {
  private readonly logger = new Logger(CsvQuoteProcessingService.name);

  constructor(
    private readonly csvParserService: CsvQuoteParserService,
    private readonly dataIngestionService: QuoteDataIngestionService,
  ) {}

  async processFile(filePath: string): Promise<void> {
    this.logger.log(`Processing file: ${filePath}`);
    try {
      const historicalQuotes = await this.csvParserService.parseCsv(filePath);
      await this.dataIngestionService.ingestHistoricalQuotes(historicalQuotes);
      this.logger.log(
        `Successfully processed and ingested data from ${filePath}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error processing file ${filePath}: ${error.message}`,
        );
      } else {
        this.logger.error(`Error processing file ${filePath}: ${error}`);
      }
      throw error; // Re-throw to be handled by the caller (main.ts)
    }
  }
}
