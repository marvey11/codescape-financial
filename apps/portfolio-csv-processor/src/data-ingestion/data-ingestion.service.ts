import { HistoricalQuote } from "@codescape-financial/historical-data-access";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class DataIngestionService {
  private readonly logger = new Logger(DataIngestionService.name);

  constructor(
    @InjectRepository(HistoricalQuote)
    private readonly historicalQuoteRepository: Repository<HistoricalQuote>,
  ) {}

  async ingestHistoricalQuotes(quotes: HistoricalQuote[]): Promise<void> {
    this.logger.log(`Attempting to ingest ${quotes.length} historical quotes.`);
    if (quotes.length === 0) {
      this.logger.log("No quotes to ingest.");
      return;
    }

    // Use upsert to prevent duplicate entries. If a quote for a given stock
    // and date already exists, it will be updated. Otherwise, it will be inserted.
    await this.historicalQuoteRepository.upsert(quotes, {
      conflictPaths: ["stock", "date"],
      skipUpdateIfNoValuesChanged: true, // Optimization
    });

    this.logger.log(
      `Successfully upserted ${quotes.length} historical quotes.`,
    );
  }
}
