import { FormButtonsComponent } from "@codescape-financial/core-ui";
import {
  CountryResponseDTO,
  UpdateCountryDTO,
} from "@codescape-financial/portfolio-data-models";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components/index.js";
import { useOutletContextData } from "../../hooks/index.js";
import { CountryForm, CountryFormData } from "./CountryForm.js";

export const EditCountryPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: country,
    sendRequest,
  } = useOutletContextData<CountryResponseDTO>();

  const [formData, setFormData] = useState<CountryFormData | undefined>();

  useEffect(() => {
    if (country) {
      setFormData(country);
    }
  }, [country]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (country && formData) {
      const payload: UpdateCountryDTO = {
        ...formData,
      };

      sendRequest({
        url: `/countries/${country.id}`,
        method: "put",
        data: payload,
      }).then(() => navigate("/countries"));
    }
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      <h1 className="mb-4 text-4xl font-extrabold">Update Country</h1>
      {formData && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-md border border-gray-300 p-6 shadow-sm"
        >
          <CountryForm value={formData} onChange={setFormData} />
          <FormButtonsComponent
            onCancel={() => navigate("..", { replace: true })}
          />
        </form>
      )}
    </DataPageContainer>
  );
};
