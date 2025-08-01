import { Button } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components";
import { DetailsActionButton } from "../../components/ActionButton";
import { useAxios } from "../../hooks";

export const StockMetadataListPage = () => {
  const navigate = useNavigate();

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
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-50 text-sm uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  ISIN
                </th>
                <th scope="col" className="px-6 py-3">
                  NSIN
                </th>
                <th scope="col" className="px-6 py-3">
                  Country
                </th>
                <th scope="col" className="px-6 py-3">
                  Currency
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map((stock) => (
                <tr
                  key={stock.id}
                  className="border-b bg-white hover:bg-gray-100"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                  >
                    {stock.name}
                  </th>
                  <td className="px-6 py-4 font-mono">{stock.isin}</td>
                  <td className="px-6 py-4 font-mono">{stock.nsin}</td>
                  <td className="px-6 py-4">{stock.country.name}</td>
                  <td className="px-6 py-4">{stock.currency}</td>
                  <td className="px-6 py-4 text-right">
                    <DetailsActionButton
                      aria-label={`Show details for ${stock.name}`}
                      onClick={() => {
                        navigate(`/stocks/${stock.id}`);
                      }}
                    >
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </DetailsActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 text-sm uppercase text-gray-700">
              <tr>
                <td className="px-6 py-3 text-right" colSpan={6}>
                  {sortedStocks.length} rows
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </DataPageContainer>
  );
};
