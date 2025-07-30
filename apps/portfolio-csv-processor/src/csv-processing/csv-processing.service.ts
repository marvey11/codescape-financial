import { Injectable, Logger } from "@nestjs/common";
import { CsvParserService } from "../csv-parser/index.js";
import { DataIngestionService } from "../data-ingestion/index.js";

@Injectable()
export class CsvProcessingService {
  private readonly logger = new Logger(CsvProcessingService.name);

  constructor(
    private readonly csvParserService: CsvParserService,
    private readonly dataIngestionService: DataIngestionService
  ) {}

  async processFile(filePath: string): Promise<void> {
    this.logger.log(`Processing file: ${filePath}`);
    try {
      const historicalQuotes = await this.csvParserService.parseCsv(filePath);
      await this.dataIngestionService.ingestHistoricalQuotes(historicalQuotes);
      this.logger.log(
        `Successfully processed and ingested data from ${filePath}`
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error processing file ${filePath}: ${error.message}`
        );
      } else {
        this.logger.error(`Error processing file ${filePath}: ${error}`);
      }
      throw error; // Re-throw to be handled by the caller (main.ts)
    }
  }
}
