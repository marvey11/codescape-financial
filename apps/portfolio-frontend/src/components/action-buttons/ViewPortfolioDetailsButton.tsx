import { ActionButton } from "@codescape-financial/core-ui";
import { PortfolioResponseDTO } from "@codescape-financial/portfolio-data-models";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";

export const ViewPortfolioDetailsButton = ({
  portfolio,
}: {
  portfolio: PortfolioResponseDTO;
}) => {
  const navigate = useNavigate();
  return (
    <ActionButton
      aria-label={`Show details for ${portfolio.name}`}
      onClick={() => {
        navigate(`/portfolios/${portfolio.id}`);
      }}
    >
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </ActionButton>
  );
};
