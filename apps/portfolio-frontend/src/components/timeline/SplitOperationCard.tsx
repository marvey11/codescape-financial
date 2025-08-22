import { PortfolioOperationTransformedDTO } from "@codescape-financial/portfolio-data-models";

export const SplitOperationCard = ({
  operation,
}: {
  operation: PortfolioOperationTransformedDTO;
}) => {
  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-md">
      <h3 className="text-lg font-bold uppercase text-orange-700">
        Stock Split
      </h3>
      <p>
        <strong>Split Ratio:</strong> {operation.splitRatio ?? "N/A"}
      </p>
      {/* You might consider adding number of shares before/after the split here if that data is available in the DTO */}
    </div>
  );
};
