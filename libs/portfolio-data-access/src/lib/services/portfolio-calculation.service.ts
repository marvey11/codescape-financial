import {
  FLOATING_POINT_TOLERANCE,
  formatNormalizedDate,
  generateHoldingListXirrKey,
  generateHoldingXirrKey,
  generatePortfolioXirrKey,
  getDateObject,
  isEffectivelyZero,
  PortfolioViewType,
  SortedList,
} from "@codescape-financial/core";
import { HistoricalQuoteService } from "@codescape-financial/historical-data-access";
import {
  AllLatestQuotesResponseDTO,
  OperationType,
  XIRRHoldingListResponseDTO,
  XIRRHoldingResponseDTO,
  XIRRPortfolioResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PortfolioHolding, PortfolioOperation } from "../entities";
import { CashFlow } from "../types";
import { PortfolioCachingService } from "./portfolio-caching.service";

const MILLISECONDS_PER_YEAR = 365 * 24 * 3600 * 1000;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MAX_ITERATIONS = 100;
const INITIAL_LOW_RATE = -0.999999;
const INITIAL_HIGH_RATE = 10.0;
const FIND_BRACKET_ITERATIONS = 50; // Max iterations for finding the XIRR bracket

@Injectable()
export class PortfolioCalculationService {
  private readonly logger = new Logger(PortfolioCalculationService.name); // Use NestJS Logger

  constructor(
    @InjectRepository(PortfolioOperation)
    private readonly operationRepository: Repository<PortfolioOperation>,
    @InjectRepository(PortfolioHolding)
    private readonly holdingRepository: Repository<PortfolioHolding>,
    private readonly historicalQuoteService: HistoricalQuoteService,
    private readonly cachingService: PortfolioCachingService,
  ) {}

  // --- Helper for Building Common Holding/Operation Queries ---
  // Abstracts common query parts to reduce duplication
  private buildBaseOperationsQuery(
    portfolioId: string,
    viewType: PortfolioViewType,
  ) {
    const queryBuilder = this.operationRepository
      .createQueryBuilder("operation")
      .leftJoinAndSelect("operation.holding", "holding")
      .leftJoinAndSelect("holding.stockMetadata", "stockMetadata")
      .where("holding.portfolioId = :portfolioId", { portfolioId });

    if (viewType === "active") {
      // Use the AND condition on the JOIN itself, as discussed previously,
      // or as a separate WHERE clause. If `holding.shares` is on the JOIN condition
      // then holdings with 0 shares might not even be returned by the join.
      // If it's a separate .andWhere, it filters results after the join.
      // Given the original snippet, it seems it was intended as a WHERE clause.
      queryBuilder.andWhere("holding.shares > :tolerance", {
        tolerance: FLOATING_POINT_TOLERANCE,
      });
    }

    return queryBuilder;
  }

  // --- Helper for Fetching Latest Quotes in Batch ---
  // Crucial for performance optimization
  private async getLatestQuotesForIsins(
    isins: string[],
  ): Promise<AllLatestQuotesResponseDTO> {
    if (isins.length === 0) {
      return {};
    }
    const latestQuotes =
      await this.historicalQuoteService.findLatestByIsins(isins);

    return latestQuotes;
  }

  // --- Helper to Consolidate & Get Holdings from Operations ---
  // More robust way to get unique holdings linked to operations
  private getUniqueHoldingsFromOperations(
    operations: PortfolioOperation[],
  ): PortfolioHolding[] {
    const holdingsMap = new Map<string, PortfolioHolding>();
    for (const op of operations) {
      if (op.holding && op.holding.id) {
        // Ensure holding and its ID exist
        holdingsMap.set(op.holding.id, op.holding);
      }
    }
    return Array.from(holdingsMap.values());
  }

  // --- calculateXIRRForPortfolio (Refactored) ---
  async calculateXIRRForPortfolioWithCache(
    portfolioId: string,
    viewType: PortfolioViewType,
  ): Promise<XIRRPortfolioResponseDTO | null> {
    const cacheKey = generatePortfolioXirrKey(portfolioId, viewType);

    return this.cachingService.getOrCreateAndCache<XIRRPortfolioResponseDTO | null>(
      cacheKey,
      async () => {
        this.logger.verbose(
          `Generating fresh XIRR data for portfolio ${portfolioId} with viewType ${viewType}`,
        );
        return this.calculateXIRRForPortfolio(portfolioId, viewType);
      },
      MILLISECONDS_PER_HOUR,
    );
  }

  async calculateXIRRForPortfolio(
    portfolioId: string,
    viewType: PortfolioViewType,
  ): Promise<XIRRPortfolioResponseDTO | null> {
    const operations = await this.buildBaseOperationsQuery(
      portfolioId,
      viewType,
    )
      .orderBy("operation.date", "ASC")
      .getMany();

    if (operations.length === 0) {
      this.logger.log(
        `No operations found for portfolio ${portfolioId} with viewType ${viewType}. Returning null.`,
      );
      return null;
    }

    const cashflows = this.convertOperationsToCashflow(operations);

    const holdings = this.getUniqueHoldingsFromOperations(operations);
    const activeHoldings = holdings.filter(
      (h) => h.shares && !isEffectivelyZero(Number(h.shares)),
    );

    // Extract unique ISINs from active holdings for batch quote fetching
    const isinsToFetch = activeHoldings
      .map((h) => h.stockMetadata?.isin)
      .filter(Boolean) as string[];

    // --- Optimization: Fetch all necessary latest quotes in parallel ---
    const latestQuotesMap = await this.getLatestQuotesForIsins(isinsToFetch);

    for (const holding of activeHoldings) {
      const latestQuote = latestQuotesMap[holding.stockMetadata.isin];

      if (latestQuote !== undefined) {
        const { date, price } = latestQuote;

        // Check if price was actually found
        cashflows.add({
          cashDate: getDateObject(date), // Use current date for market value
          cashAmount: Number(holding.shares) * price,
        });
      } else {
        this.logger.warn(
          `No latest quote found for ISIN: ${holding.stockMetadata.isin} for portfolio XIRR calculation.`,
        );
      }
    }

    const calculationDate =
      cashflows.get(cashflows.size - 1)?.cashDate ?? new Date();

    return {
      portfolioId,
      date: formatNormalizedDate(calculationDate),
      xirr: this.calculateXIRR(cashflows),
    };
  }

  async calculateXIRRForHoldingListWithCache(
    portfolioId: string,
    viewType: PortfolioViewType,
  ): Promise<XIRRHoldingListResponseDTO> {
    const cacheKey = generateHoldingListXirrKey(portfolioId, viewType);

    return this.cachingService.getOrCreateAndCache<XIRRHoldingListResponseDTO>(
      cacheKey,
      async () => {
        this.logger.verbose(
          `Generating fresh XIRR data for holdings in portfolio ${portfolioId} with viewType ${viewType}`,
        );
        return this.calculateXIRRForHoldingList(portfolioId, viewType);
      },
      MILLISECONDS_PER_HOUR,
    );
  }

  // --- calculateXIRRForHoldingList (Refactored) ---
  async calculateXIRRForHoldingList(
    portfolioId: string,
    viewType: PortfolioViewType,
  ): Promise<XIRRHoldingListResponseDTO> {
    const queryBuilder = this.holdingRepository
      .createQueryBuilder("holding")
      .leftJoinAndSelect("holding.stockMetadata", "stockMetadata")
      .where("holding.portfolioId = :portfolioId", { portfolioId });

    if (viewType === "active") {
      queryBuilder.andWhere("holding.shares > :tolerance", {
        tolerance: FLOATING_POINT_TOLERANCE,
      });
    }

    const holdings = await queryBuilder.getMany();

    if (holdings.length === 0) {
      return {};
    }

    // --- Optimization: Pre-fetch all operations for all holdings in one go ---
    const holdingIds = holdings.map((h) => h.id);
    const allOperations = await this.operationRepository.find({
      where: { holdingId: In(holdingIds) }, // Use In operator for batch fetching
      relations: { holding: { stockMetadata: true } }, // Ensure relations are loaded
      order: { date: "ASC" },
    });

    // Group operations by holdingId for easy lookup
    const operationsByHoldingId = new Map<string, PortfolioOperation[]>();
    for (const op of allOperations) {
      const holdingOps = operationsByHoldingId.get(op.holdingId) ?? [];
      holdingOps.push(op);
      operationsByHoldingId.set(op.holdingId, holdingOps);
    }

    // --- Optimization: Pre-fetch all necessary latest quotes in parallel for all holdings ---
    const isinsToFetch = holdings
      .map((h) => h.stockMetadata?.isin)
      .filter(Boolean) as string[];
    const latestQuotesMap = await this.getLatestQuotesForIsins(isinsToFetch);

    const result: XIRRHoldingListResponseDTO = {};

    // --- Optimization: Process each holding's XIRR in parallel ---

    // Use Promise.allSettled to ensure all calculations run and gather results,
    // even if some individual holding XIRR calculations encounter issues.
    const xirrPromises = holdings.map(async (holding) => {
      const holdingOperations = operationsByHoldingId.get(holding.id) ?? [];
      if (holdingOperations.length === 0) {
        this.logger.warn(
          `No operations for holding ${holding.id}. Skipping XIRR calculation.`,
        );
        return null; // Or return a DTO indicating no data
      }

      const cashflows = this.convertOperationsToCashflow(holdingOperations);

      if (holding && !isEffectivelyZero(Number(holding.shares))) {
        const latestQuote = latestQuotesMap[holding.stockMetadata.isin];
        if (latestQuote !== undefined) {
          const { date, price } = latestQuote;

          cashflows.add({
            cashDate: getDateObject(date),
            cashAmount: Number(holding.shares) * price,
          });
        } else {
          this.logger.warn(
            `No latest quote found for ISIN: ${holding.stockMetadata.isin} for holding ${holding.id} XIRR calculation.`,
          );
          // Decide how to handle this: skip XIRR, use 0 price, etc. For now, it will proceed but NPV might be off.
        }
      }

      // Ensure there are enough cashflows for XIRR calculation after adding market value
      if (cashflows.size < 2) {
        this.logger.warn(
          `Insufficient cashflows for holding ${holding.id} (${cashflows.size} found). Skipping XIRR calculation.`,
        );
        return null;
      }

      const calculationDate =
        cashflows.get(cashflows.size - 1)?.cashDate ?? new Date();

      return {
        isin: holding.stockMetadata.isin ?? "",
        date: formatNormalizedDate(calculationDate),
        xirr: this.calculateXIRR(cashflows),
        holdingId: holding.id, // Include holdingId for mapping back to result
      } as XIRRHoldingResponseDTO & { holdingId: string }; // Temp type for mapping
    });

    const settledResults = await Promise.allSettled(xirrPromises);

    settledResults.forEach((settledResult) => {
      if (
        settledResult.status === "fulfilled" &&
        settledResult.value !== null
      ) {
        const { isin, date, xirr, holdingId } = settledResult.value;
        if (isin) {
          // Ensure ISIN is valid
          result[isin] = { date, xirr };
        } else {
          this.logger.error(
            `XIRR result for holdingId ${holdingId} missing ISIN.`,
          );
        }
      } else if (settledResult.status === "rejected") {
        this.logger.error(
          `Failed to calculate XIRR for a holding: ${settledResult.reason}`,
        );
      }
    });

    return result;
  }

  async calculateXIRRForHoldingWithCache(
    portfolioId: string,
    holdingId: string,
  ): Promise<XIRRHoldingResponseDTO | null> {
    const cacheKey = generateHoldingXirrKey(portfolioId, holdingId);

    return this.cachingService.getOrCreateAndCache<XIRRHoldingResponseDTO | null>(
      cacheKey,
      async () => {
        this.logger.verbose(
          `Generating fresh XIRR data for holding ${holdingId} in portfolio ${portfolioId}`,
        );
        return this.calculateXIRRForHolding(portfolioId, holdingId);
      },
      MILLISECONDS_PER_HOUR,
    );
  }

  // This method is now only for a SINGLE holding and doesn't need to fetch relations if called
  // from calculateXIRRForHoldingList because relations are already eager-loaded.
  // It's also suitable for direct calls for a single holding XIRR.
  async calculateXIRRForHolding(
    portfolioId: string, // Kept for context/validation, not strictly used in current find operation
    holdingId: string,
  ): Promise<XIRRHoldingResponseDTO | null> {
    // Optimization: Fetch operations and holding details in one go
    // Use findOne to get the specific holding and its operations
    const holding = await this.holdingRepository.findOne({
      where: { id: holdingId, portfolioId }, // Ensure holding belongs to the portfolio
      relations: { operations: { holding: true }, stockMetadata: true }, // Load operations and stock metadata
      order: {
        operations: { date: "ASC" }, // Order operations by date for XIRR
      },
    });

    if (!holding) {
      this.logger.warn(
        `Holding ${holdingId} not found in portfolio ${portfolioId}. Returning null.`,
      );
      return null;
    }

    const operations = holding.operations || [];

    if (operations.length === 0) {
      this.logger.log(
        `No operations found for holding ${holdingId}. Returning null.`,
      );
      return null; // No operations found for this holding
    }

    const cashflows = this.convertOperationsToCashflow(operations);

    // --- Optimization: Fetch single latest quote ---

    if (!isEffectivelyZero(Number(holding.shares))) {
      // Only add market value if shares exist
      const latestQuote = await this.historicalQuoteService.findLatestByIsin(
        holding.stockMetadata.isin,
      );
      if (latestQuote) {
        const { date, price } = latestQuote; // Note: 'date' from latestQuote is the quote date, not current date
        cashflows.add({
          cashDate: getDateObject(date), // Use the date of the quote for the cashflow
          cashAmount: Number(holding.shares) * price,
        });
      } else {
        this.logger.warn(
          `No latest quote found for ISIN: ${holding.stockMetadata.isin} for holding ${holdingId}. Market value not included in XIRR.`,
        );
      }
    }

    // Ensure there are enough cashflows for XIRR calculation after adding market value
    if (cashflows.size < 2) {
      this.logger.warn(
        `Insufficient cashflows for holding ${holdingId} (${cashflows.size} found). Returning null for XIRR.`,
      );
      return null;
    }

    // Date for the XIRR result DTO should be the date of the last cashflow (usually today/latest quote date)
    const calculationDate =
      cashflows.get(cashflows.size - 1)?.cashDate ?? new Date();

    return {
      isin: holding?.stockMetadata?.isin ?? "",
      date: formatNormalizedDate(calculationDate),
      xirr: this.calculateXIRR(cashflows),
    };
  }

  // --- calculateXIRR (Algorithm) ---

  /**
   * Evaluates the Money-Weighted Rate of Return (MWRR) using the Extended Internal Rate of Return
   * (XIRR) method for a portfolio position or even a complete portfolio.
   *
   * @param cashflows The sorted list of cashflows.
   * @returns The annualised rate of return for this position.
   */
  private calculateXIRR(cashflows: SortedList<CashFlow>): number {
    if (cashflows.size < 2) {
      this.logger.warn("XIRR requires at least two cash flows. Returning NaN.");
      return NaN;
    }

    const cashflowArray = cashflows.toArray();

    // The start date for XIRR calculation is the date of the first cash flow.
    const startDate = (cashflowArray[0] as CashFlow).cashDate;

    // Helper function to calculate Net Present Value for a given rate
    const getNetPresentValue = (rate: number): number => {
      let npv = 0;
      for (const { cashDate, cashAmount } of cashflowArray) {
        // Handle division by zero for rate = -1 (which would make 1+rate = 0)
        // This can happen during initial bracketing.
        if (1 + rate === 0) {
          if (cashAmount === 0) continue; // If amount is 0 and divisor is 0, it's indeterminate but won't change NPV.
          return cashAmount > 0 ? Infinity : -Infinity; // If amount is non-zero, NPV goes to +/- infinity.
        }
        npv +=
          cashAmount /
          Math.pow(
            1 + rate,
            (cashDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_YEAR,
          );
      }
      return npv;
    };

    let low = INITIAL_LOW_RATE;
    let high = INITIAL_HIGH_RATE;

    // Step 1: Find a bracket where NPV changes sign (root exists)
    let npvLow = getNetPresentValue(low);
    let npvHigh = getNetPresentValue(high);

    // Initial check for a bracket, if not found, expand the search range
    let foundBracket = npvLow * npvHigh <= 0;

    if (!foundBracket) {
      // Expand search range (outward from initial low/high)
      for (let i = 0; i < FIND_BRACKET_ITERATIONS && !foundBracket; i++) {
        low *= 2; // Expand left
        high *= 2; // Expand right
        npvLow = getNetPresentValue(low);
        npvHigh = getNetPresentValue(high);
        if (npvLow * npvHigh <= 0) {
          foundBracket = true;
          break;
        }
      }
    }

    if (!foundBracket) {
      this.logger.warn(
        "XIRR: Could not find a rate range that brackets the XIRR. Result may be inaccurate or NaN.",
      );
      return NaN; // No clear root found
    }

    // Step 2: Perform Bisection Method
    let rate = 0;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      rate = (low + high) / 2;
      const npv = getNetPresentValue(rate);

      if (isEffectivelyZero(npv)) {
        return rate; // Found the rate within tolerance
      }

      if (npv > 0) {
        low = rate; // XIRR is higher than current `rate`
      } else {
        high = rate; // XIRR is lower than current `rate`
      }
    }

    this.logger.warn(
      "XIRR: Did not converge within the maximum number of iterations. Returning last calculated rate.",
    );

    return rate;
  }

  private convertOperationsToCashflow(
    operations: PortfolioOperation[],
  ): SortedList<CashFlow> {
    const result = new SortedList<CashFlow>((a, b) => {
      return a.cashDate.getTime() - b.cashDate.getTime();
    });

    for (const operation of operations) {
      const { date: cashDate, type } = operation;

      let cashAmount: number | undefined; // Initialize as undefined

      const numberOfShares = Number(operation.numberOfShares ?? 0);
      const pricePerShare = Number(operation.pricePerShare ?? 0);
      const fees = Number(operation.fees ?? 0);
      const taxes = Number(operation.taxes ?? 0);
      const dividendPerShare = Number(operation.dividendPerShare ?? 0);
      const applicableShares = Number(operation.applicableShares ?? 0);
      const exchangeRate = Number(operation.exchangeRate ?? 1);

      switch (type) {
        case OperationType.BUY:
          cashAmount = -(numberOfShares * pricePerShare + fees);
          break;

        case OperationType.SELL:
          cashAmount = numberOfShares * pricePerShare - fees - taxes;
          break;

        case OperationType.DIVIDEND:
          // Handle potential division by zero for exchangeRate
          if (exchangeRate === 0) {
            this.logger.error(
              `Division by zero for dividend operation ${operation.id}: exchangeRate is 0.`,
            );
            cashAmount = undefined; // Or throw an error, depending on desired behavior
          } else {
            cashAmount =
              (dividendPerShare * applicableShares) / exchangeRate - taxes;
          }
          break;

        case OperationType.STOCK_SPLIT:
          // Stock splits are non-cash events and should not be included in cash flow for XIRR
          continue; // Skip adding to cashflows

        // Add other cases or a default if other OperationTypes might appear and need handling
        default:
          this.logger.warn(
            `Unknown operation type: ${type} for operation ${operation.id}. Skipping cashflow.`,
          );
          continue;
      }

      // Only add to result if cashAmount was successfully determined
      if (cashAmount !== undefined) {
        result.add({ cashDate: getDateObject(cashDate), cashAmount }); // Ensure cashDate is always a Date object
      }
    }

    return result;
  }
}
