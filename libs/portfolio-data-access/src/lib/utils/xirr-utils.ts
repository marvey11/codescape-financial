import { SortedList } from "@codescape-financial/core";
import { OperationType } from "@codescape-financial/portfolio-data-models";
import { PortfolioOperation } from "../entities";
import { CashFlow } from "../types";

export const convertOperationsToCashflow = (
  operations: PortfolioOperation[],
) => {
  const result = new SortedList<CashFlow>((a, b) => {
    return a.cashDate.getTime() - b.cashDate.getTime();
  });

  for (const operation of operations) {
    const { date: cashDate, type } = operation;

    let cashAmount: number;

    switch (type) {
      case OperationType.BUY: {
        const { numberOfShares, pricePerShare, fees = "0" } = operation;
        cashAmount = -(
          Number(numberOfShares) * Number(pricePerShare) +
          Number(fees)
        );
        break;
      }

      case OperationType.SELL: {
        const {
          numberOfShares,
          pricePerShare,
          fees = "0",
          taxes = "0",
        } = operation;
        cashAmount =
          Number(numberOfShares) * Number(pricePerShare) -
          Number(fees) -
          Number(taxes);
        break;
      }

      case OperationType.DIVIDEND: {
        const {
          dividendPerShare,
          applicableShares,
          exchangeRate,
          taxes = "0",
        } = operation;
        cashAmount =
          (Number(dividendPerShare) * Number(applicableShares)) /
            Number(exchangeRate) -
          Number(taxes);
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
};
