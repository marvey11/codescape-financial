import { ActionButton } from "@codescape-financial/core-ui";
import { PortfolioHoldingEmbeddedDTO } from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router-dom";
import { Icon } from "../icons";

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
      aria-label={`Add operation for holding ${holding.stock.name}`}
      onClick={() => {
        navigate(
          `/portfolios/${portfolioId}/holdings/${holding.id}/operations/add?${queryString}`,
        );
      }}
    >
      <Icon name="AddOperation" aria-hidden="true" />
    </ActionButton>
  );
};
