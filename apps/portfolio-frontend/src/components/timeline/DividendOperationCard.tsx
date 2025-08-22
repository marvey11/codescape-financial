import { formatCurrency } from "@codescape-financial/core";
import { PortfolioOperationTransformedDTO } from "@codescape-financial/portfolio-data-models";

export const DividendOperationCard = ({
  operation,
}: {
  operation: PortfolioOperationTransformedDTO;
}) => {
  const applicableShares = operation.applicableShares ?? 0;
  const dividendPerShare = operation.dividendPerShare ?? 0;
  const exchangeRate = operation.exchangeRate ?? 1;
  const taxes = operation.taxes ?? 0;

  const totalAmount =
    (applicableShares * dividendPerShare) / exchangeRate - taxes;

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-md">
      <h3 className="text-lg font-bold uppercase text-blue-700">Dividend</h3>
      <div className="grid grid-cols-2 gap-x-4 text-sm">
        <p>
          <strong>Dividend per Share:</strong>&nbsp;
          {dividendPerShare}
        </p>
        <p>
          <strong>Applicable Shares:</strong>&nbsp;
          {applicableShares.toFixed(3)}
        </p>
        <p>
          <strong>Exchange Rate:</strong>&nbsp;
          {exchangeRate}
        </p>
        <p>
          <strong>Taxes:</strong>&nbsp;{formatCurrency(taxes)}
        </p>
        <p className="col-span-2 mt-1 text-base font-bold text-blue-800">
          Total:&nbsp;{formatCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
};
