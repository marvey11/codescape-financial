import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAxios } from "../hooks";
import { UseGenericContextType } from "../types";

export const StockMetadataLayout = () => {
  const { id } = useParams();

  const { loading, error, data, sendRequest } = useAxios<StockResponseDTO>();

  useEffect(() => {
    id && sendRequest({ url: `/stock-metadata/${id}`, method: "get" });
  }, [id, sendRequest]);

  return (
    <Outlet
      context={
        {
          loading,
          error,
          data,
          sendRequest,
        } satisfies UseGenericContextType<StockResponseDTO>
      }
    />
  );
};
