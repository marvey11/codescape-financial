import { PortfolioResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAxios } from "../../hooks";
import { UseGenericContextType } from "../../types";

export const PortfolioLayout = () => {
  const { portfolioId } = useParams();

  const { loading, error, data, sendRequest } =
    useAxios<PortfolioResponseDTO>();

  useEffect(() => {
    if (portfolioId) {
      sendRequest({ url: `/portfolios/${portfolioId}`, method: "get" });
    }
  }, [portfolioId, sendRequest]);

  return (
    <Outlet
      context={
        {
          loading,
          error,
          data,
          sendRequest,
        } satisfies UseGenericContextType<PortfolioResponseDTO>
      }
    />
  );
};
