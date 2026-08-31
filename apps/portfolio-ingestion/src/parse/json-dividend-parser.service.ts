import { StockMetadata } from "@codescape-financial/historical-data-access";
import { CreateDividendDTO } from "@codescape-financial/portfolio-data-models";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { readFile } from "node:fs/promises";
import { In, Repository } from "typeorm";
import { RawDividendRecordListSchema } from "./types";

@Injectable()
export class JsonDividendParserService {
  private readonly logger = new Logger(JsonDividendParserService.name);

  constructor(
    @InjectRepository(StockMetadata)
    private readonly stockMetadataRepository: Repository<StockMetadata>,
  ) {}

  async readDividendJsonFile(
    jsonFilePath: string,
    portfolioId: string,
  ): Promise<CreateDividendDTO[]> {
    const rawDividendsData = await readFile(jsonFilePath, "utf8").then(
      JSON.parse,
    );
    const validatedData = RawDividendRecordListSchema.parse(rawDividendsData);

    const isins = validatedData.map(({ isin }) => isin);
    if (isins.length === 0) {
      this.logger.log("Dividend data file is empty or contains no ISINs.");
      return [];
    }

    // Fetch all necessary stock metadata in a single query
    const stocks = await this.stockMetadataRepository.find({
      where: { isin: In(isins) },
      relations: { country: true },
    });

    // Create a map for efficient lookup
    const stockMap = new Map<string, StockMetadata>();
    for (const stock of stocks) {
      stockMap.set(stock.isin, stock);
    }

    const dividendDTOs: CreateDividendDTO[] = [];

    for (const rawDividendRecord of validatedData) {
      const { isin, dividends } = rawDividendRecord;
      const stock = stockMap.get(isin);

      if (!stock || !stock.country) {
        this.logger.warn(
          `Stock with ISIN ${isin} or its country not found in database. Skipping dividends.`,
        );
        continue;
      }

      for (const {
        date,
        dividendPerShare,
        shares,
        exchangeRate,
      } of dividends) {
        // --- Dividend Calculation ---
        const effectiveExchangeRate = exchangeRate ?? 1.0;

        const dividend = new CreateDividendDTO();
        dividend.portfolioId = portfolioId;
        dividend.stockId = stock.id;
        dividend.date = date;
        dividend.dividendPerShare = dividendPerShare;
        dividend.applicableShares = shares;
        dividend.exchangeRate = effectiveExchangeRate;
        dividendDTOs.push(dividend);
      }
    }

    this.logger.log(
      `Successfully parsed ${dividendDTOs.length} dividend operations.`,
    );
    return dividendDTOs;
  }
}
