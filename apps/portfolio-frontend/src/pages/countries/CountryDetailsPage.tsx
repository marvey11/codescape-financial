import { formatPercent } from "@codescape-financial/core";
import { DataTable, Tag } from "@codescape-financial/core-ui";
import {
  CountryResponseDTO,
  StockResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataPageContainer,
  DetailsPageHeader,
  ViewStockDetailsButton,
} from "../../components";
import { useAxios, useOutletContextData } from "../../hooks";
import { buildStockMetadataTableSchema } from "../../utils";

export const CountryDetailsPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: country,
    sendRequest,
  } = useOutletContextData<CountryResponseDTO>();

  const { data: countryStocks, sendRequest: sendStocksForCountryRequest } =
    useAxios<StockResponseDTO[]>();

  useEffect(() => {
    country &&
      sendStocksForCountryRequest({
        url: `/stock-metadata?countryId=${country.id}`,
        method: "get",
      });
  }, [country, sendStocksForCountryRequest]);

  const handleDelete = () => {
    country &&
      sendRequest({
        url: `/countries/${country.id}`,
        method: "delete",
      } satisfies AxiosRequestConfig).then(() => {
        navigate("/countries");
      });
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {country && (
        <div className="flex flex-col gap-3">
          <DetailsPageHeader
            title={country.name}
            editPath={`/countries/${country.id}/edit`}
            onDelete={handleDelete}
          >
            <CountryTags country={country} />
          </DetailsPageHeader>

          {countryStocks?.length ? (
            <>
              <h2 className="text-2xl font-extrabold">Stock List</h2>
              <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                <CountryStockTable data={countryStocks} />
              </div>
            </>
          ) : (
            <span>No stocks found for this country.</span>
          )}
        </div>
      )}
    </DataPageContainer>
  );
};

const CountryTags = ({ country }: { country: CountryResponseDTO }) => (
  <>
    <Tag variant="primary" title="ISO Code">
      {country.countryCode}
    </Tag>
    <Tag title="Withholding Tax Rate">
      {formatPercent(country.withholdingTaxRate)}
    </Tag>
  </>
);

const CountryStockTable = ({ data }: { data: StockResponseDTO[] }) => {
  const columns = useMemo(
    () =>
      buildStockMetadataTableSchema({
        columnKeys: ["name", "isin", "nsin", "currency"],
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
