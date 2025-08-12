import { isEffectivelyZero, SortedList } from "@codescape-financial/core";
import { Injectable } from "@nestjs/common";
import { CashFlow } from "../types";

const MILLISECONDS_PER_YEAR = 365 * 24 * 3600 * 1000;
const MAX_ITERATIONS = 100;

@Injectable()
export class XIRRCalculationService {
  /**
   * Evaluates the Money-Weighted Rate of Return (MWRR) using the Extended Internal Rate of Return
   * (XIRR) method for a portfolio position or even a complete portfolio.
   *
   * @param cashflows The sorted list of cashflows.
   * @returns The annualised rate of return for this position.
   */
  calculateXIRR(cashflows: SortedList<CashFlow>): number {
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
}
