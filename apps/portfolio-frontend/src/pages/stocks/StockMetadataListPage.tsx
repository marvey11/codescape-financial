import {
  ActionButton,
  Button,
  ColumnSchema,
  DataTable,
} from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components";
import { useAxios } from "../../hooks";

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
            columns={stockTableSchema}
            data={sortedStocks}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}
    </DataPageContainer>
  );
};

const ViewStockDetailsButton = ({ stock }: { stock: StockResponseDTO }) => {
  const navigate = useNavigate();
  return (
    <ActionButton
      aria-label={`Show details for ${stock.name}`}
      onClick={() => {
        navigate(`/stocks/${stock.id}`);
      }}
    >
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </ActionButton>
  );
};

const stockTableSchema: ColumnSchema<StockResponseDTO>[] = [
  {
    header: "Name",
    value: (item) => item.name,
  },
  {
    header: "ISIN",
    value: (item) => item.isin,
    cellClassNames: "font-mono",
  },
  {
    header: "NSIN",
    value: (item) => item.nsin,
    cellClassNames: "font-mono",
  },
  {
    header: "Country",
    value: (item) => item.country.name,
  },
  {
    header: "Currency",
    value: (item) => item.currency,
  },
  {
    header: undefined,
    value: (item) => <ViewStockDetailsButton stock={item} />,
    headerClassNames: "text-right",
    cellClassNames: "text-right",
    footer: (data) => `${data.length} rows`,
    footerClassNames: "text-right uppercase",
  },
];
