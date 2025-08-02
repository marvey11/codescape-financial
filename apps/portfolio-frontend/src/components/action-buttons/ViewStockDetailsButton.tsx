import { ActionButton } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";

export const ViewStockDetailsButton = ({
  stock,
}: {
  stock: StockResponseDTO;
}) => {
  const navigate = useNavigate();
  return (
    <ActionButton
      aria-label={`Show details for ${stock.name}`}
      onClick={() => {
        navigate(`/stocks/${stock.id}`);
      }}
    >
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </ActionButton>
  );
};
