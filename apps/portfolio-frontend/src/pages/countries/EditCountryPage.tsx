import {
  CountryResponseDTO,
  UpdateCountryDTO,
} from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router";
import { CountryAPI } from "../../api";
import { DataPageContainer } from "../../components";
import { ROUTES } from "../../config/routes";
import { useOutletContextData } from "../../hooks";
import { CountryForm, CountryFormData } from "./CountryForm";

export const EditCountryPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: country,
    sendRequest,
  } = useOutletContextData<CountryResponseDTO>();

  const handleSubmit = (data: CountryFormData) => {
    if (country && data) {
      const payload = {
        ...data,
      } satisfies UpdateCountryDTO;

      const config = CountryAPI.getEditCountryConfig(country.id, payload);
      sendRequest(config).then(() => {
        navigate(ROUTES.COUNTRIES);
      });
    }
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      <h1 className="mb-4 text-4xl font-extrabold">Update Country</h1>
      {country && (
        <CountryForm
          value={{ ...country } satisfies CountryFormData}
          onSubmit={handleSubmit}
          onCancel={() => {
            navigate(ROUTES.COUNTRIES, { replace: true });
          }}
        />
      )}
    </DataPageContainer>
  );
};
