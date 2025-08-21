import { sortDataArray } from "@codescape-financial/core";
import {
  CountryResponseDTO,
  CreateStockDTO,
} from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks";
import {
  CountrySelectOption,
  StockFormData,
  StockMetadataForm,
} from "./StockMetadataForm";

export const AddStockMetadataPage = () => {
  const navigate = useNavigate();

  const { sendRequest } = useAxios();

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
    sendCountriesRequest({ url: "/countries", method: "get" });
  }, [sendCountriesRequest]);

  const handleSubmit = (data: StockFormData) => {
    const payload: CreateStockDTO = {
      ...data,
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
      <StockMetadataForm
        availableCountries={sortedCountries ?? []}
        onSubmit={handleSubmit}
        onCancel={() => navigate("..", { replace: true })}
      />
    </div>
  );
};
