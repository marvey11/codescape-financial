import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { StockMetadataAPI } from "../../api";
import { useAxios } from "../../hooks";
import { UseGenericContextType } from "../../types";

export const StockMetadataLayout = () => {
  const { id } = useParams();

  const { loading, error, data, sendRequest } = useAxios<StockResponseDTO>();

  useEffect(() => {
    if (id) {
      const config = StockMetadataAPI.getStockByIdConfig(id);
      sendRequest(config);
    }
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
