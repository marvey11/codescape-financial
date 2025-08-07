import { PortfolioResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAxios } from "../../hooks";
import { UseGenericContextType } from "../../types";

export const PortfolioLayout = () => {
  const { id } = useParams();

  const { loading, error, data, sendRequest } =
    useAxios<PortfolioResponseDTO>();

  useEffect(() => {
    id && sendRequest({ url: `/portfolios/${id}`, method: "get" });
  }, [id, sendRequest]);

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
