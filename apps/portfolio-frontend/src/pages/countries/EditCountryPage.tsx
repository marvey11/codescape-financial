import {
  CountryResponseDTO,
  UpdateCountryDTO,
} from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components";
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
      const payload: UpdateCountryDTO = {
        ...data,
      };

      sendRequest({
        url: `/countries/${country.id}`,
        method: "put",
        data: payload,
      }).then(() => {
        navigate("/countries");
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
          onCancel={() => navigate("..", { replace: true })}
        />
      )}
    </DataPageContainer>
  );
};
