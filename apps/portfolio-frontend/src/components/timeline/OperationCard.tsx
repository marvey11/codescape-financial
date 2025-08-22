import {
  OperationType,
  PortfolioOperationTransformedDTO,
} from "@codescape-financial/portfolio-data-models";
import { BuyOperationCard } from "./BuyOperationCard";
import { DividendOperationCard } from "./DividendOperationCard";
import { SellOperationCard } from "./SellOperationCard";
import { SplitOperationCard } from "./SplitOperationCard";

export const OperationCard = ({
  operation,
}: {
  operation: PortfolioOperationTransformedDTO;
}) => {
  switch (operation.type) {
    case OperationType.BUY:
      return <BuyOperationCard operation={operation} />;
    case OperationType.SELL:
      return <SellOperationCard operation={operation} />;
    case OperationType.DIVIDEND:
      return <DividendOperationCard operation={operation} />;
    case OperationType.STOCK_SPLIT:
      return <SplitOperationCard operation={operation} />;
    default:
      return null;
  }
};
