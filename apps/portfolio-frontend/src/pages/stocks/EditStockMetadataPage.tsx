import { sortDataArray } from "@codescape-financial/core";
import {
  CountryResponseDTO,
  StockResponseDTO,
  UpdateStockDTO,
} from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CountryAPI, StockMetadataAPI } from "../../api";
import { DataPageContainer } from "../../components";
import { ROUTES } from "../../config/routes";
import { useAxios, useOutletContextData } from "../../hooks";
import {
  CountrySelectOption,
  StockFormData,
  StockMetadataForm,
} from "./StockMetadataForm";

export const EditStockMetadataPage = () => {
  const navigate = useNavigate();

  const {
    loading: isStockLoading,
    error: stockError,
    data: stock,
    sendRequest: sendStockRequest,
  } = useOutletContextData<StockResponseDTO>();

  const { data: countries, sendRequest: sendCountriesRequest } =
    useAxios<CountryResponseDTO[]>();

  const sortedCountries = useMemo(
    () =>
      countries
        ? sortDataArray(
            countries.map(
              ({ id, name, countryCode }) =>
                ({ id, name, countryCode }) satisfies CountrySelectOption,
            ),
            "name",
          )
        : undefined,
    [countries],
  );

  useEffect(() => {
    const config = CountryAPI.getAllCountriesConfig();
    sendCountriesRequest(config);
  }, [sendCountriesRequest]);

  const handleSubmit = (data: StockFormData) => {
    if (stock && data) {
      const payload = {
        ...data,
      } satisfies UpdateStockDTO;

      const config = StockMetadataAPI.getEditStockConfig(stock.id, payload);
      sendStockRequest(config).then(() => {
        navigate(ROUTES.STOCKS);
      });
    }
  };

  return (
    <DataPageContainer isLoading={isStockLoading} error={stockError}>
      <h1 className="mb-4 text-4xl font-extrabold">Update Stock</h1>
      {stock && (
        <StockMetadataForm
          availableCountries={sortedCountries ?? []}
          value={
            { ...stock, countryId: stock.country.id } satisfies StockFormData
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            navigate(ROUTES.STOCKS, { replace: true });
          }}
        />
      )}
    </DataPageContainer>
  );
};
