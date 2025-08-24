import { sortDataArray } from "@codescape-financial/core";
import { Button, DataTable } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StockMetadataAPI } from "../../api";
import { DataPageContainer } from "../../components";
import { ViewDetailsActionButton } from "../../components/action-buttons";
import { ROUTES } from "../../config/routes";
import { useAxios } from "../../hooks";
import {
  buildStockDetailsRoute,
  buildStockMetadataColumnSchema,
} from "../../utils";

export const StockMetadataListPage = () => {
  const { loading, error, data, sendRequest } = useAxios<StockResponseDTO[]>();

  useEffect(() => {
    const config = StockMetadataAPI.getAllStocksConfig();
    sendRequest(config);
  }, [sendRequest]);

  const sortedStocks = useMemo(
    () => (data ? sortDataArray(data, "name") : undefined),
    [data],
  );

  return (
    <DataPageContainer isLoading={loading} error={error}>
      <span className="mb-3 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-extrabold">Stock Universe</h1>
        <Link to={ROUTES.ADD_STOCK}>
          <Button>Add Stock</Button>
        </Link>
      </span>

      {sortedStocks && (
        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
          <StockMetadataTable data={sortedStocks} />
        </div>
      )}
    </DataPageContainer>
  );
};

const StockMetadataTable = ({ data }: { data: StockResponseDTO[] }) => {
  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      buildStockMetadataColumnSchema({
        actionsComponent: ({ data }) =>
          data ? (
            <ViewDetailsActionButton
              label={`Show details for ${data.name}`}
              onClick={() => {
                navigate(buildStockDetailsRoute(data.id));
              }}
            />
          ) : null,
      }),
    [navigate],
  );

  return (
    <DataTable<StockResponseDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
