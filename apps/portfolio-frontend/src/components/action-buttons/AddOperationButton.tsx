import { ActionButton } from "@codescape-financial/core-ui";
import { PortfolioHoldingEmbeddedDTO } from "@codescape-financial/portfolio-data-models";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";

interface Props {
  portfolioId: string;
  holding: PortfolioHoldingEmbeddedDTO;
}

export const AddOperationButton = ({ portfolioId, holding }: Props) => {
  const navigate = useNavigate();

  const queryString = new URLSearchParams({
    portfolioId,
    holdingId: holding.id,
    stockId: holding.stock.id,
  }).toString();

  return (
    <ActionButton
      aria-label={`Add operation for ${holding.stock.name}`}
      onClick={() => {
        navigate(`/operations/add?${queryString}`);
      }}
    >
      <PlusIcon className="h-6 w-6" aria-hidden="true" />
    </ActionButton>
  );
};
