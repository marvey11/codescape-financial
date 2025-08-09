import { StockMetadata } from "@codescape-financial/historical-data-access";
import {
  CreateBuyTransactionDTO,
  CreateSellTransactionDTO,
} from "@codescape-financial/portfolio-data-models";
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import csv from "csv-parser";
import { createReadStream } from "node:fs";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { Repository } from "typeorm";
import { RawTransactionDataRow } from "./types";
import { transformRawCsvToTransactionData } from "./utils";

@Injectable()
export class CsvTransactionParserService {
  private readonly logger = new Logger(CsvTransactionParserService.name);
  // Cache for StockMetadata to avoid repeated DB lookups for the same ISIN
  private stockMetadataCache: Map<string, StockMetadata | null> = new Map();

  constructor(
    @InjectRepository(StockMetadata)
    private readonly stockMetadataRepository: Repository<StockMetadata>,
  ) {}

  /**
   * Parses a CSV file containing raw transaction data and processes them.
   * Rows are skipped if StockMetadata is not found or if the transaction data is incomplete.
   * This method now uses the PortfolioOperationService to create and apply operations.
   * It assigns all transactions to the provided portfolioId.
   *
   * @param csvFilePath The path to the CSV file.
   * @param portfolioId The ID of the portfolio to which these transactions belong.
   * @returns A Promise resolving to an array of processed PortfolioOperation entities (returned by the service).
   */
  async parseCsv(
    csvFilePath: string,
    portfolioId: string,
  ): Promise<(CreateBuyTransactionDTO | CreateSellTransactionDTO)[]> {
    this.logger.log(
      `Starting transaction CSV parsing for file: ${csvFilePath} for portfolio: ${portfolioId}`,
    );

    const parsedTransactions: (
      | CreateBuyTransactionDTO
      | CreateSellTransactionDTO
    )[] = [];

    this.stockMetadataCache.clear(); // Clear cache for each new CSV parse operation

    const sourceStream = createReadStream(csvFilePath);
    const csvParserStream = csv({
      separator: ",",
      mapHeaders: ({ header }) => headerMapping[header.trim()] ?? null,
      skipLines: 0,
    });

    const dataProcessingStream = new Writable({
      objectMode: true,
      // The `write` method must accept a callback and call it to signal completion.
      // We wrap the async logic in a try/catch to handle errors correctly.
      write: (
        data: RawTransactionDataRow,
        encoding: BufferEncoding,
        callback: (error?: Error | null) => void,
      ) => {
        this.processRow(data, portfolioId, parsedTransactions)
          .then(() => callback()) // Signal success
          .catch((error) => callback(error)); // Signal error
      },
    });

    try {
      await pipeline(sourceStream, csvParserStream, dataProcessingStream);
      this.logger.log(
        `Finished parsing CSV file ${csvFilePath}. Found ${parsedTransactions.length} transactions.`,
      );
      return parsedTransactions;
    } catch (error) {
      this.logger.error(
        `Error during CSV stream pipeline for ${csvFilePath}`,
        error,
        error instanceof Error ? error.stack : undefined,
      );
      throw new UnprocessableEntityException(
        `Failed to parse CSV file ${csvFilePath}: ${
          error instanceof Error ? error.message : "An unknown error occurred."
        }`,
      );
    } finally {
      this.stockMetadataCache.clear();
    }
  }

  /**
   * Processes a single row of data from the CSV, converting it into a DTO.
   * This logic is extracted to make the `write` stream handler cleaner.
   */
  private async processRow(
    data: RawTransactionDataRow,
    portfolioId: string,
    parsedTransactions: (CreateBuyTransactionDTO | CreateSellTransactionDTO)[],
  ): Promise<void> {
    // Skip rows that are empty or don't have essential data for core mapping
    if (!data.executionDate || !data.isin || !data.type) {
      this.logger.warn(
        `Skipping row due to missing essential data (date, ISIN, type): ${JSON.stringify(
          data,
        )}`,
      );
      return;
    }

    // --- 1. Get/Cache StockMetadata ---
    let stock: StockMetadata | null | undefined = this.stockMetadataCache.get(
      data.isin,
    );

    if (stock === undefined) {
      // Not in cache, attempt to fetch from DB
      stock = await this.stockMetadataRepository.findOne({
        where: { isin: data.isin },
      });
      this.stockMetadataCache.set(data.isin, stock); // Cache result (even if null)
    }

    // --- 2. Skip row if StockMetadata does not exist ---
    if (!stock) {
      this.logger.verbose(
        `Ignoring row for ISIN '${data.isin}' as no corresponding StockMetadata was found.`,
      );
      return; // Skip this row, as we cannot link it to a valid stock
    }

    const { date, shares, pricePerShare, fees } =
      transformRawCsvToTransactionData(data);

    // --- 3. Create DTO instance based on transaction type ---
    switch (data.type) {
      case "Kauf": {
        const buyDto = Object.assign(new CreateBuyTransactionDTO(), {
          portfolioId,
          stockId: stock.id,
          date,
          shares,
          pricePerShare,
          fees,
        });
        parsedTransactions.push(buyDto);
        break;
      }
      case "Verkauf": {
        const sellDto = Object.assign(new CreateSellTransactionDTO(), {
          portfolioId,
          stockId: stock.id,
          date,
          shares,
          pricePerShare,
          fees,
        });
        parsedTransactions.push(sellDto);
        break;
      }
      default:
        this.logger.warn(
          `Unknown transaction type '${data.type}' for ISIN '${data.isin}'. Skipping row.`,
        );
        return; // Skip row if type is unhandled
    }
  }
}

const headerMapping: { [key: string]: keyof RawTransactionDataRow } = {
  Abrechnungstag: "processingDate",
  "Datum Ausführung": "executionDate",
  ISIN: "isin",
  Geschäftsart: "type",
  "Stücke/Nom.": "shares",
  Kurs: "pricePerShare",
  // both headers apply for `fees` (old and new format)
  "Entgelt (Summe eigen und fremd)": "fees",
  "Entgelt (Summe eigen und fremd) EUR": "fees",
  // taxes are not included in the CSV file
};
