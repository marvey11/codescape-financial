import { formatNormalizedDate } from "@codescape-financial/core";
import { cn } from "@codescape-financial/core-ui";
import {
  OperationType,
  PortfolioOperationTransformedDTO,
} from "@codescape-financial/portfolio-data-models";
import {
  ArrowsRightLeftIcon,
  CurrencyEuroIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { OperationCard } from "./OperationCard";

const dotBorderColor: { [key in OperationType]: string } = {
  [OperationType.BUY]: "border-green-500",
  [OperationType.SELL]: "border-red-500",
  [OperationType.DIVIDEND]: "border-blue-500",
  [OperationType.STOCK_SPLIT]: "border-orange-500",
};

const dotIcon = {
  [OperationType.BUY]: <PlusIcon className="h-6 w-6 text-green-500" />,
  [OperationType.SELL]: <MinusIcon className="h-6 w-6 text-red-500" />,
  [OperationType.DIVIDEND]: (
    <CurrencyEuroIcon className="h-6 w-6 text-blue-500" />
  ),
  [OperationType.STOCK_SPLIT]: (
    <ArrowsRightLeftIcon className="h-5 w-5 text-orange-500" />
  ),
};

export const OperationTimeline = ({
  operations,
}: {
  operations: PortfolioOperationTransformedDTO[];
}) => {
  return (
    <div className="relative py-8">
      {/* Central vertical line */}
      <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 transform rounded-full bg-gray-200"></div>
      {/* Added rounded-full for softer edges */}
      {operations.map((op, index) => (
        <div
          key={op.id}
          className={cn(
            "relative mb-8 flex w-full items-center",
            // Alternate card/date side, but the dot's position is absolute
            index % 2 === 0 ? "flex-row-reverse" : "",
          )}
        >
          {/* Card side (adjust padding if needed after dot is absolute) */}
          <div
            className={cn(
              "w-1/2 px-8",
              index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left",
            )}
          >
            <OperationCard operation={op} />
          </div>

          {/* Timeline Dot with Icon - Positioned absolutely within its relative parent row */}
          <div
            className={cn(
              "absolute left-1/2 z-10 flex h-8 w-8 flex-shrink-0 -translate-x-1/2 transform items-center justify-center rounded-full border-4 bg-white shadow-md",
              dotBorderColor[op.type],
            )}
            style={{ top: "50%", transform: "translate(-50%, -50%)" }} // Added top and Y-axis centering for perfect alignment
          >
            {dotIcon[op.type]}
          </div>

          {/* Date Side (alternating left/right) */}
          <div
            className={cn(
              "w-1/2 px-8",
              index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left",
            )}
          >
            {/* Adjusted padding */}
            <span className="text-sm font-bold text-gray-600">
              {formatNormalizedDate(op.date, "en-GB")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
