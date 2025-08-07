import { FormButtonsComponent } from "@codescape-financial/core-ui";
import {
  CountryResponseDTO,
  CreateStockDTO,
} from "@codescape-financial/portfolio-data-models";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/index.js";
import { StockFormData, StockMetadataForm } from "./StockMetadataForm.js";

export const AddStockMetadataPage = () => {
  const navigate = useNavigate();

  const { sendRequest } = useAxios();

  const { data: countries, sendRequest: sendCountriesRequest } =
    useAxios<CountryResponseDTO[]>();

  const [formData, setFormData] = useState<StockFormData>({
    name: "",
    isin: "",
    nsin: "",
    currency: "",
    countryId: "",
  });
  const [countryList, setCountryList] = useState<CountryResponseDTO[]>([]);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: CreateStockDTO = {
      ...formData,
    };
    sendRequest({ url: "/stock-metadata", method: "post", data: payload }).then(
      () => {
        navigate("/stocks");
      },
    );
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Create Stock</h1>
      {countryList && (
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
              navigate("..", { replace: true });
            }}
          />
        </form>
      )}
    </div>
  );
};
