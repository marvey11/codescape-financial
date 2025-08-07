import { Button, DataTable } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataPageContainer } from "../../components";
import { ViewStockDetailsButton } from "../../components/action-buttons";
import { useAxios } from "../../hooks";
import { buildStockMetadataTableSchema } from "../../utils";

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
          <StockMetadataTable data={sortedStocks} />
        </div>
      )}
    </DataPageContainer>
  );
};

const StockMetadataTable = ({ data }: { data: StockResponseDTO[] }) => {
  const columns = useMemo(
    () =>
      buildStockMetadataTableSchema({
        actionsComponent: (item) => <ViewStockDetailsButton stock={item} />,
      }),
    [],
  );

  return (
    <DataTable<StockResponseDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
