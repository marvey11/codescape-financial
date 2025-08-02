import {
  HistoricalQuote,
  StockMetadata,
} from "@codescape-financial/historical-data-access";
import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import csv from "csv-parser";
import { createReadStream } from "node:fs";
import * as readline from "node:readline";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { Repository } from "typeorm";
import { RawQuoteDataRow } from "./parser-types.js";
import { transformRawCsvToPartialHistoricalQuote } from "./parser-utils.js";

@Injectable()
export class CsvParserService {
  private readonly logger = new Logger(CsvParserService.name);

  constructor(
    @InjectRepository(StockMetadata)
    private readonly stockMetadataRepository: Repository<StockMetadata>,
  ) {}

  /**
   * Asynchronously reads the first line of a file.
   * Uses modern async iteration for robustness, correctly handling empty files.
   * @param filePath The path to the file.
   * @returns The first line of the file.
   * @throws {UnprocessableEntityException} if the file is empty or unreadable.
   */
  private async getFirstLine(filePath: string): Promise<string> {
    const fileStream = createReadStream(filePath, { encoding: "latin1" });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Handles all newline character combinations
    });

    for await (const line of rl) {
      rl.close();
      return line;
    }

    // This is reached only if the file is empty.
    throw new UnprocessableEntityException(`File is empty: ${filePath}`);
  }

  async parseCsv(filePath: string): Promise<HistoricalQuote[]> {
    this.logger.log(`Starting CSV parsing for file: ${filePath}`);

    const firstLine = await this.getFirstLine(filePath);
    const wknMatch = firstLine.match(/WKN: (\w{6})/);
    if (!wknMatch || !wknMatch[1]) {
      throw new UnprocessableEntityException(
        `Could not find NSIN/WKN in file: ${filePath}`,
      );
    }
    const wkn = wknMatch[1];
    this.logger.log(`Found WKN ${wkn} in file ${filePath}`);

    const stock = await this.stockMetadataRepository.findOne({
      // The database column is likely `nsin` for generality, but we are querying with a specific WKN.
      where: { nsin: wkn },
    });

    if (!stock) {
      throw new NotFoundException(`StockMetadata with WKN ${wkn} not found.`);
    }

    const quotes: HistoricalQuote[] = [];

    const sourceStream = createReadStream(filePath, { encoding: "latin1" });
    const csvParserStream = csv({
      separator: ";",
      skipLines: 2, // Skips the metadata line and the blank line
      mapHeaders: ({ header }) => headerMapping[header] ?? null,
    });

    // This custom writable stream processes each parsed row from the CSV
    const dataProcessingStream = new Writable({
      objectMode: true,
      write(data: RawQuoteDataRow, encoding, callback) {
        // Skip rows that are empty or don't have a date
        if (!data.date) {
          return callback();
        }

        const quote = new HistoricalQuote();
        quote.stock = stock;
        Object.assign(quote, transformRawCsvToPartialHistoricalQuote(data));
        quotes.push(quote);
        callback();
      },
    });

    try {
      await pipeline(sourceStream, csvParserStream, dataProcessingStream);
      this.logger.log(
        `Finished parsing CSV. Found ${quotes.length} quotes for WKN ${wkn}.`,
      );
      return quotes;
    } catch (error) {
      this.logger.error(
        `Error during CSV stream pipeline for ${filePath}`,
        error,
      );
      throw new UnprocessableEntityException(
        `Failed to parse CSV file ${filePath}: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }
}

const headerMapping: { [key: string]: keyof RawQuoteDataRow } = {
  Datum: "date",
  Eröffnung: "open",
  Hoch: "high",
  Tief: "low",
  Schluss: "close",
  Volumen: "volume",
};
