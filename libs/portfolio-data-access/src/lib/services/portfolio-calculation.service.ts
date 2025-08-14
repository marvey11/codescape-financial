import {
  FLOATING_POINT_TOLERANCE,
  formatNormalizedDate,
  getDateObject,
  isEffectivelyZero,
  SortedList,
} from "@codescape-financial/core";
import { HistoricalQuoteService } from "@codescape-financial/historical-data-access";
import {
  OperationType,
  XIRRHoldingBatchResponseDTO,
  XIRRHoldingResponseDTO,
  XIRRPortfolioResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PortfolioHolding, PortfolioOperation } from "../entities";
import { CashFlow } from "../types";

const MILLISECONDS_PER_YEAR = 365 * 24 * 3600 * 1000;
const MAX_ITERATIONS = 100;

@Injectable()
export class PortfolioCalculationService {
  private readonly logger = new Logger(PortfolioCalculationService.name);

  constructor(
    @InjectRepository(PortfolioOperation)
    private readonly operationRepository: Repository<PortfolioOperation>,
    @InjectRepository(PortfolioHolding)
    private readonly holdingRepository: Repository<PortfolioHolding>,
    private readonly historicalQuoteService: HistoricalQuoteService,
  ) {}

  async calculatePortfolioXIRR(
    portfolioId: string,
    activeOnly: boolean,
  ): Promise<XIRRPortfolioResponseDTO | null> {
    this.logger.verbose(activeOnly);
    const queryBuilder = this.operationRepository
      .createQueryBuilder("operation")
      .leftJoinAndSelect("operation.holding", "holding")
      .leftJoinAndSelect("holding.stockMetadata", "stockMetadata")
      .where("holding.portfolioId = :portfolioId", { portfolioId });

    if (activeOnly) {
      queryBuilder.andWhere("holding.shares > :tolerance", {
        tolerance: FLOATING_POINT_TOLERANCE,
      });
    }

    const operations = await queryBuilder
      .orderBy("operation.date", "ASC")
      .getMany();

    if (operations.length === 0) {
      return null;
    }

    const cashflows = this.convertOperationsToCashflow(operations);

    const holdingsMap = new Map<string, PortfolioHolding>();
    for (const op of operations) {
      if (op.holding && !holdingsMap.has(op.holding.id)) {
        holdingsMap.set(op.holding.id, op.holding);
      }
    }

    const holdings = Array.from(holdingsMap.values());

    for (const holding of holdings) {
      if (holding && !isEffectivelyZero(Number(holding.shares))) {
        const latestQuote = await this.historicalQuoteService.findLatestByIsin(
          holding.stockMetadata.isin,
        );
        if (latestQuote) {
          const { date, price } = latestQuote;
          cashflows.add({
            cashDate: getDateObject(date),
            cashAmount: Number(holding.shares) * price,
          });
        }
      }
    }

    const date = cashflows.get(cashflows.size - 1)?.cashDate ?? new Date();

    return {
      portfolioId,
      date: formatNormalizedDate(date),
      xirr: this.calculateXIRR(cashflows),
    };
  }

  async calculateBatchXIRRForPortfolio(
    portfolioId: string,
    isins: string[],
  ): Promise<XIRRPortfolioResponseDTO | null> {
    const operations = await this.operationRepository.find({
      where: {
        holding: {
          portfolioId,
          stockMetadata: {
            isin: In(isins),
          },
        },
      },
      relations: ["holding", "holding.stockMetadata"],
      order: { date: "ASC" },
    });

    if (operations.length === 0) {
      return null;
    }

    const cashflows = this.convertOperationsToCashflow(operations);

    const holdingsMap = new Map<string, PortfolioHolding>();
    for (const op of operations) {
      if (op.holding && !holdingsMap.has(op.holding.id)) {
        holdingsMap.set(op.holding.id, op.holding);
      }
    }

    const holdings = Array.from(holdingsMap.values());

    for (const holding of holdings) {
      if (holding && !isEffectivelyZero(Number(holding.shares))) {
        const latestQuote = await this.historicalQuoteService.findLatestByIsin(
          holding.stockMetadata.isin,
        );
        if (latestQuote) {
          const { date, price } = latestQuote;
          cashflows.add({
            cashDate: getDateObject(date),
            cashAmount: Number(holding.shares) * price,
          });
        }
      }
    }

    const date = cashflows.get(cashflows.size - 1)?.cashDate ?? new Date();

    return {
      portfolioId,
      date: formatNormalizedDate(date),
      xirr: this.calculateXIRR(cashflows),
    };
  }

  async calculateBatchXIRRForHoldings(
    portfolioId: string,
    isins: string[],
  ): Promise<XIRRHoldingBatchResponseDTO> {
    const holdings = await this.holdingRepository.find({
      where: {
        portfolioId,
        stockMetadata: {
          isin: In(isins),
        },
      },
      relations: ["stockMetadata"],
    });

    const result: XIRRHoldingBatchResponseDTO = {};

    for (const holding of holdings) {
      const xirrDto = await this.calculateXIRRForHolding(
        portfolioId,
        holding.id,
      );

      if (xirrDto) {
        const { xirr, date } = xirrDto;
        result[holding.stockMetadata.isin] = { date, xirr };
      }
    }

    return result;
  }

  async calculateXIRRForHolding(
    portfolioId: string,
    holdingId: string,
  ): Promise<XIRRHoldingResponseDTO | null> {
    const operations = await this.operationRepository.find({
      where: {
        holdingId,
        holding: {
          portfolioId,
        },
      },
      relations: ["holding", "holding.stockMetadata"],
      order: { date: "ASC" },
    });

    if (operations.length === 0) {
      return null; // No operations found for this holding
    }

    const cashflows = this.convertOperationsToCashflow(operations);

    const holding = operations[0]?.holding;
    if (holding && !isEffectivelyZero(Number(holding.shares))) {
      const latestQuote = await this.historicalQuoteService.findLatestByIsin(
        holding.stockMetadata.isin,
      );
      if (latestQuote) {
        const { date, price } = latestQuote;
        cashflows.add({
          cashDate: getDateObject(date),
          cashAmount: Number(holding.shares) * price,
        });
      }
    }

    const date = cashflows.get(cashflows.size - 1)?.cashDate ?? new Date();

    return {
      isin: holding?.stockMetadata.isin ?? "",
      date: formatNormalizedDate(date ?? new Date()),
      xirr: this.calculateXIRR(cashflows),
    };
  }

  /**
   * Evaluates the Money-Weighted Rate of Return (MWRR) using the Extended Internal Rate of Return
   * (XIRR) method for a portfolio position or even a complete portfolio.
   *
   * @param cashflows The sorted list of cashflows.
   * @returns The annualised rate of return for this position.
   */
  private calculateXIRR(cashflows: SortedList<CashFlow>): number {
    if (cashflows.size < 2) {
      return NaN; // Need at least two cash flows (initial investment and at least one return)
    }

    const cashflowArray = cashflows.toArray();

    // get the earliest date in the cashflows
    const startDate = (cashflowArray[0] as CashFlow).cashDate;

    const getNetPresentValue = (rate: number): number => {
      let npv = 0;
      for (const { cashDate, cashAmount } of cashflowArray) {
        npv +=
          cashAmount /
          Math.pow(
            1 + rate,
            (cashDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_YEAR,
          );
      }

      return npv;
    };

    let low = -0.999999;
    let high = 10.0;

    if (getNetPresentValue(low) * getNetPresentValue(high) > 0) {
      let tempLow = low;
      let tempHigh = high;
      let foundBracket = false;

      for (let i = 0; i < 50 && !foundBracket; i++) {
        tempLow = tempLow * 2;
        if (getNetPresentValue(tempLow) * getNetPresentValue(tempHigh) <= 0) {
          low = tempLow;
          foundBracket = true;
        }
      }

      if (!foundBracket) {
        tempLow = low;
        tempHigh = high;
        for (let i = 0; i < 50 && !foundBracket; i++) {
          tempHigh = tempHigh * 2;
          if (getNetPresentValue(tempLow) * getNetPresentValue(tempHigh) <= 0) {
            high = tempHigh;
            foundBracket = true;
          }
        }
      }

      if (!foundBracket) {
        console.warn(
          "Warning: Could not find a rate range that brackets the XIRR. Result may be inaccurate or NaN.",
        );
        return NaN; // No clear root found
      }
    }

    let rate = 0;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      rate = (low + high) / 2;
      const npv = getNetPresentValue(rate);

      if (isEffectivelyZero(npv)) {
        return rate; // Found the rate within tolerance
      }

      if (npv > 0) {
        low = rate; // XIRR is higher than current 'rate'
      } else {
        high = rate; // XIRR is lower than current 'rate'
      }
    }

    console.warn(
      "Warning: XIRR did not converge within the maximum number of iterations.",
    );

    return rate;
  }

  private convertOperationsToCashflow(operations: PortfolioOperation[]) {
    const result = new SortedList<CashFlow>((a, b) => {
      return a.cashDate.getTime() - b.cashDate.getTime();
    });

    for (const operation of operations) {
      const { date: cashDate, type } = operation;

      let cashAmount: number;

      switch (type) {
        case OperationType.BUY: {
          const { numberOfShares, pricePerShare, fees } = operation;
          cashAmount = -(
            Number(numberOfShares) * Number(pricePerShare) +
            Number(fees ?? "0")
          );
          break;
        }

        case OperationType.SELL: {
          const { numberOfShares, pricePerShare, fees, taxes } = operation;
          cashAmount =
            Number(numberOfShares) * Number(pricePerShare) -
            Number(fees ?? "0") -
            Number(taxes ?? "0");
          break;
        }

        case OperationType.DIVIDEND: {
          const { dividendPerShare, applicableShares, exchangeRate, taxes } =
            operation;
          cashAmount =
            (Number(dividendPerShare) * Number(applicableShares)) /
              Number(exchangeRate) -
            Number(taxes ?? "0");
          break;
        }

        default: {
          // ignore other operation types
          continue;
        }
      }

      result.add({ cashDate, cashAmount });
    }

    return result;
  }
}
