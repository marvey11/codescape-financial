import { ActionButton } from "@codescape-financial/core-ui";
import { PortfolioHoldingEmbeddedDTO } from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router";
import { buildAddOperationRoute } from "../../utils";
import { Icon } from "../icons";

interface Props {
  portfolioId: string;
  holding: PortfolioHoldingEmbeddedDTO;
}

export const AddOperationButton = ({ portfolioId, holding }: Props) => {
  const navigate = useNavigate();

  return (
    <ActionButton
      aria-label={`Add operation for holding ${holding.stock.name}`}
      onClick={() => {
        navigate(
          buildAddOperationRoute(portfolioId, holding.id, holding.stock.id),
        );
      }}
    >
      <Icon name="AddOperation" aria-hidden="true" />
    </ActionButton>
  );
};
