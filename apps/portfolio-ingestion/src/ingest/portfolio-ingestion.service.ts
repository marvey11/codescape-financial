import { ConfigService } from "@codescape-financial/portfolio-config";
import {
  PortfolioBuyTransaction,
  PortfolioHolding,
  PortfolioOperation,
  PortfolioOperationService,
} from "@codescape-financial/portfolio-data-access";
import {
  CreateBuyTransactionDTO,
  CreateDividendDTO,
  CreateSellTransactionDTO,
  CreateStockSplitDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs/promises";
import * as path from "path";
import { In, Repository } from "typeorm";
import {
  CsvTransactionParserService,
  JsonDividendParserService,
  JsonStockSplitParserService,
} from "../parse";

// A union type for all possible operation DTOs, which helps with type safety.
type OperationDTO =
  | CreateBuyTransactionDTO
  | CreateSellTransactionDTO
  | CreateDividendDTO
  | CreateStockSplitDTO;

/**
 * Orchestrates the entire portfolio data ingestion process.
 * It collects data from all sources, sorts them chronologically,
 * and processes them in order to ensure correct portfolio state calculation.
 */
@Injectable()
export class PortfolioIngestionService {
  private readonly logger = new Logger(PortfolioIngestionService.name);
  private readonly defaultPortfolioId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly transactionParser: CsvTransactionParserService,
    private readonly dividendParser: JsonDividendParserService,
    private readonly stockSplitParser: JsonStockSplitParserService,
    private readonly operationService: PortfolioOperationService,
    @InjectRepository(PortfolioOperation)
    private readonly operationRepository: Repository<PortfolioOperation>,
    @InjectRepository(PortfolioHolding)
    private readonly holdingRepository: Repository<PortfolioHolding>,
    @InjectRepository(PortfolioBuyTransaction)
    private readonly buyOperationRepository: Repository<PortfolioBuyTransaction>,
  ) {
    this.defaultPortfolioId = this.configService.getDefaultPortfolioId();
  }

  /**
   * Main entry point for the ingestion process.
   * Reads all files from the configured input directories, parses them,
   * sorts all operations chronologically, and then creates them in the database.
   */
  async ingestAllOperations(): Promise<void> {
    this.logger.log("Starting full portfolio ingestion process...");

    // Reset the portfolio state before starting the ingestion
    await this.resetPortfolioState(this.defaultPortfolioId);

    const allDtos = await this.parseAllSources();

    this.logger.log(
      `Parsing complete. Found a total of ${allDtos.length} operations from all sources.`,
    );

    // Sort all operations by date to ensure they are processed in the correct order.
    // This is crucial for accurate FIFO and state calculations.
    allDtos.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    this.logger.log(`Total of ${allDtos.length} operations to process.`);

    for (const dto of allDtos) {
      try {
        await this.processOperation(dto);
      } catch (error) {
        this.logger.error(
          `Failed to process operation. DTO: ${JSON.stringify(dto)}`,
          error instanceof Error ? error.stack : String(error),
        );
        // Re-throw to halt the entire ingestion process, as intended.
        throw error;
      }
    }

    this.logger.log("Full portfolio ingestion process completed successfully.");
  }

  private async parseAllSources(): Promise<OperationDTO[]> {
    const stockSplitFile = this.configService.getStockSplitsInputFile();
    const transactionFiles = await this.getFilesInDir(
      this.configService.getTransactionsInputDir(),
    );
    const dividendFile = this.configService.getDividendsInputFile();
    const transactionPromises = transactionFiles.map((file) =>
      this.transactionParser.parseCsv(file, this.defaultPortfolioId),
    );
    // Re-enable parsing for dividends and stock splits
    const dividendPromise = this.dividendParser.readDividendJsonFile(
      dividendFile,
      this.defaultPortfolioId,
    );
    const stockSplitPromise = this.stockSplitParser.readStockSplitJsonFile(
      stockSplitFile,
      this.defaultPortfolioId,
    );

    this.logger.log(
      `Waiting for ${transactionPromises.length} transaction file(s) to be parsed...`,
    );

    const results = await Promise.all([
      ...transactionPromises,
      dividendPromise,
      stockSplitPromise,
    ]);

    this.logger.log("All parsing promises have resolved.");

    // Flatten the array of arrays into a single array of DTOs
    return results.flat();
  }

  private async processOperation(dto: OperationDTO): Promise<void> {
    if (dto instanceof CreateBuyTransactionDTO) {
      await this.operationService.createBuyOperation(dto);
    } else if (dto instanceof CreateSellTransactionDTO) {
      await this.operationService.createSellOperation(dto);
    } else if (dto instanceof CreateDividendDTO) {
      await this.operationService.createDividendOperation(dto);
    } else if (dto instanceof CreateStockSplitDTO) {
      await this.operationService.createStockSplitOperation(dto);
    } else {
      const constructorName =
        Object.getPrototypeOf(dto)?.constructor?.name ?? "unknown";
      this.logger.warn(
        `Unknown DTO type encountered during processing. Received object of type: ${constructorName}`,
      );
    }
  }

  private async getFilesInDir(dirPath: string): Promise<string[]> {
    try {
      const dirents = await fs.readdir(dirPath, { withFileTypes: true });
      return dirents
        .filter((dirent) => dirent.isFile())
        .map((dirent) => path.join(dirPath, dirent.name));
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        this.logger.warn(`Directory not found, skipping: ${dirPath}`);
        return [];
      }
      throw error;
    }
  }

  /**
   * Deletes all existing data for a given portfolio to ensure a clean slate
   * before ingestion. This makes the ingestion process idempotent.
   * @param portfolioId The ID of the portfolio to reset.
   */
  private async resetPortfolioState(portfolioId: string): Promise<void> {
    this.logger.log(`Resetting data for portfolio ID: ${portfolioId}`);

    // 1. Find all holding IDs for the given portfolio.
    const holdings = await this.holdingRepository.find({
      where: { portfolioId },
      select: { id: true },
    });

    if (holdings.length === 0) {
      this.logger.log(
        "No existing holdings found for this portfolio. Nothing to reset.",
      );
      return;
    }

    const holdingIds = holdings.map((h) => h.id);

    // The order of deletion is important to respect foreign key constraints.
    // We delete entities that have foreign keys to PortfolioHolding first.

    // 2. Delete all FIFO tracking records (PortfolioBuyTransaction) associated with these holdings.
    await this.buyOperationRepository.delete({ holdingId: In(holdingIds) });
    this.logger.log(
      "Deleted existing transaction buy operations (FIFO state).",
    );

    // 3. Delete all historical operations (PortfolioOperation) associated with these holdings.
    await this.operationRepository.delete({ holdingId: In(holdingIds) });
    this.logger.log("Deleted existing portfolio operations.");

    // 4. Finally, delete the holdings themselves.
    await this.holdingRepository.delete({ portfolioId });
    this.logger.log("Deleted existing portfolio holdings.");
  }
}
