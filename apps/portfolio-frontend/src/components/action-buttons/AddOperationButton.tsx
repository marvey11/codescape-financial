import { ActionButton } from "@codescape-financial/core-ui";
import { PortfolioHoldingEmbeddedDTO } from "@codescape-financial/portfolio-data-models";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  portfolioId: string;
  holding: PortfolioHoldingEmbeddedDTO;
}

export const AddOperationButton = ({ portfolioId, holding }: Props) => {
  const navigate = useNavigate();

  const queryString = new URLSearchParams({
    stockId: holding.stock.id,
  }).toString();

  return (
    <ActionButton
      aria-label={`Add operation for ${holding.stock.name}`}
      onClick={() => {
        navigate(
          `/portfolios/${portfolioId}/holdings/${holding.id}/operations/add?${queryString}`,
        );
      }}
    >
      <Plus className="h-5 w-5 text-gray-500" aria-hidden="true" />
    </ActionButton>
  );
};
