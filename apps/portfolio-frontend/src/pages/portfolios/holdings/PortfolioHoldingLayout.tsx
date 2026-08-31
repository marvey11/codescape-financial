import { PortfolioHoldingResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { PortfolioHoldingAPI } from "../../../api";
import { useAxios } from "../../../hooks";
import { UseGenericContextType } from "../../../types";

export const PortfolioHoldingLayout = () => {
  const { portfolioId, holdingId } = useParams();

  const { loading, error, data, sendRequest } =
    useAxios<PortfolioHoldingResponseDTO>();

  useEffect(() => {
    if (portfolioId && holdingId) {
      const config = PortfolioHoldingAPI.getOneHoldingConfig(
        portfolioId,
        holdingId,
      );
      sendRequest(config);
    }
  }, [portfolioId, holdingId, sendRequest]);

  return (
    <Outlet
      context={
        {
          loading,
          error,
          data,
          sendRequest,
        } satisfies UseGenericContextType<PortfolioHoldingResponseDTO>
      }
    />
  );
};
