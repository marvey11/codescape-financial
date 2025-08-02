import { Button, DataTable } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ViewStockDetailsButton } from "../../components/action-buttons/index.js";
import { DataPageContainer } from "../../components/index.js";
import { useAxios } from "../../hooks/index.js";
import { buildStockMetadataTableSchema } from "../../utils/index.js";

export const StockMetadataListPage = () => {
  const { loading, error, data, sendRequest } = useAxios<StockResponseDTO[]>();

  useEffect(() => {
    sendRequest({ url: "/stock-metadata", method: "get" });
  }, [sendRequest]);

  const sortedStocks = useMemo(() => {
    if (!data) {
      return undefined;
    }
    const stockArray = [...data];
    stockArray.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );
    return stockArray;
  }, [data]);

  return (
    <DataPageContainer isLoading={loading} error={error}>
      <span className="mb-3 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-extrabold">Stock Universe</h1>
        <Link to="/stocks/add">
          <Button>Add Stock</Button>
        </Link>
      </span>

      {sortedStocks && (
        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
          <DataTable<StockResponseDTO>
            columns={buildStockMetadataTableSchema({
              actionsComponent: (item) => (
                <ViewStockDetailsButton stock={item} />
              ),
            })}
            data={sortedStocks}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}
    </DataPageContainer>
  );
};
