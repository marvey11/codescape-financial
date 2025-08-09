import { StockMetadata } from "@codescape-financial/historical-data-access";
import { CreateStockSplitDTO } from "@codescape-financial/portfolio-data-models";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { readFile } from "node:fs/promises";
import { In, Repository } from "typeorm";
import { RawStockSplitRecordSchema } from "./types";

@Injectable()
export class JsonStockSplitParserService {
  private readonly logger = new Logger(JsonStockSplitParserService.name);

  constructor(
    @InjectRepository(StockMetadata)
    private readonly stockMetadataRepository: Repository<StockMetadata>,
  ) {}

  async readStockSplitJsonFile(
    jsonFilePath: string,
    portfolioId: string,
  ): Promise<CreateStockSplitDTO[]> {
    const rawSplitsData = await readFile(jsonFilePath, "utf8").then(JSON.parse);
    const validatedData = RawStockSplitRecordSchema.parse(rawSplitsData);

    const isins = Object.keys(validatedData);
    if (isins.length === 0) {
      this.logger.log("Stock split data file is empty or contains no ISINs.");
      return [];
    }

    // Fetch all necessary stock metadata in a single query
    const stocks = await this.stockMetadataRepository.find({
      where: { isin: In(isins) },
    });

    // Create a map for efficient lookup
    const stockMap = new Map<string, StockMetadata>();
    for (const stock of stocks) {
      stockMap.set(stock.isin, stock);
    }

    const stockSplitDTOs: CreateStockSplitDTO[] = [];

    for (const [isin, splits] of Object.entries(validatedData)) {
      const stock = stockMap.get(isin);

      if (!stock) {
        this.logger.warn(
          `Stock with ISIN ${isin} not found in database. Skipping splits.`,
        );
        continue;
      }

      for (const { splitDate, splitRatio } of splits) {
        const stockSplit = new CreateStockSplitDTO();
        stockSplit.portfolioId = portfolioId;
        stockSplit.stockId = stock.id;
        stockSplit.date = splitDate;
        stockSplit.splitRatio = splitRatio;
        stockSplitDTOs.push(stockSplit);
      }
    }

    this.logger.log(
      `Successfully parsed ${stockSplitDTOs.length} stock split operations.`,
    );
    return stockSplitDTOs;
  }
}
