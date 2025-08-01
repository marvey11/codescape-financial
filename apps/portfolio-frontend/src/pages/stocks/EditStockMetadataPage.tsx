import { FormButtonsComponent } from "@codescape-financial/core-ui";
import {
  CountryResponseDTO,
  StockResponseDTO,
  UpdateStockDTO,
} from "@codescape-financial/portfolio-data-models";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataPageContainer, StockMetadataForm } from "../../components";
import { StockFormData } from "../../components/StockMetadataForm";
import { useAxios, useOutletContextData } from "../../hooks";

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

  const [formData, setFormData] = useState<StockFormData | undefined>();
  const [countryList, setCountryList] = useState<CountryResponseDTO[]>([]);

  useEffect(() => {
    if (stock) {
      const { country, ...rest } = stock;
      setFormData({ ...rest, countryId: country.id });
    }
  }, [stock]);

  useEffect(() => {
    sendCountriesRequest({ url: "/countries", method: "get" });
  }, [sendCountriesRequest]);

  useEffect(() => {
    if (countries) {
      const countryArray = [...countries];
      countryArray.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
      setCountryList(countryArray);
    }
  }, [countries]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (stock && formData) {
      const payload: UpdateStockDTO = {
        ...formData,
      };

      sendStockRequest({
        url: `/stock-metadata/${stock.id}`,
        method: "put",
        data: payload,
      }).then(() => navigate("/stocks"));
    }
  };

  return (
    <DataPageContainer isLoading={isStockLoading} error={stockError}>
      <h1 className="mb-4 text-4xl font-extrabold">Update Stock</h1>
      {formData && countryList && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-md border border-gray-300 p-6 shadow-sm"
        >
          <StockMetadataForm
            availableCountries={countryList}
            value={formData}
            onChange={setFormData}
          />
          <FormButtonsComponent
            onCancel={() => {
              navigate("/stocks");
            }}
          />
        </form>
      )}
    </DataPageContainer>
  );
};
