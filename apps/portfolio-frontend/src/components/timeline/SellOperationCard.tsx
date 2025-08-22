import { formatCurrency } from "@codescape-financial/core";
import { PortfolioOperationTransformedDTO } from "@codescape-financial/portfolio-data-models";

export const SellOperationCard = ({
  operation,
}: {
  operation: PortfolioOperationTransformedDTO;
}) => {
  const numberOfShares = operation.shares ?? 0;
  const pricePerShare = operation.pricePerShare ?? 0;
  const fees = operation.fees ?? 0;
  const taxes = operation.taxes ?? 0;

  const totalAmount = numberOfShares * pricePerShare + fees + taxes;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-md">
      {/* Added border */}
      <h3 className="text-lg font-bold uppercase text-red-700">Sell</h3>
      {/* Darker text for contrast */}
      <div className="grid grid-cols-2 gap-x-4 text-sm">
        {/* Use grid for better layout */}
        <p>
          <strong>Shares:</strong>&nbsp;{numberOfShares.toFixed(3)}
        </p>
        <p>
          <strong>Fees:</strong>&nbsp;{formatCurrency(fees)}
        </p>
        <p>
          <strong>Price:</strong>&nbsp;{formatCurrency(pricePerShare)}
        </p>
        <p>
          <strong>Taxes:</strong>&nbsp;{formatCurrency(taxes)}
        </p>
        <p className="col-span-2 mt-1 text-base font-bold text-red-800">
          {/* Span two columns */}
          Total:&nbsp;{formatCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
};
