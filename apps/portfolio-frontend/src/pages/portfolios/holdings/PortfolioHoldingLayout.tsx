import { PortfolioHoldingResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAxios } from "../../../hooks";
import { UseGenericContextType } from "../../../types";

export const PortfolioHoldingLayout = () => {
  const { portfolioId, holdingId } = useParams();

  const { loading, error, data, sendRequest } =
    useAxios<PortfolioHoldingResponseDTO>();

  useEffect(() => {
    if (portfolioId && holdingId) {
      sendRequest({
        url: `/portfolios/${portfolioId}/holdings/${holdingId}`,
        method: "get",
      });
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
