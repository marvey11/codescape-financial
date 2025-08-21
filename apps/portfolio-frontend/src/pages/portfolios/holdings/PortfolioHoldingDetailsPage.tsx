import { PortfolioHoldingResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useOutletContextData } from "../../../hooks";

export const PortfolioHoldingDetailsPage = () => {
  useOutletContextData<PortfolioHoldingResponseDTO>();

  return <h1>PortfolioHoldingDetailsPage</h1>;
};
