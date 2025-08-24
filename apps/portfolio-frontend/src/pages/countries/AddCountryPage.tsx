import { CreateCountryDTO } from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api-endpoints";
import { ROUTES } from "../../config/routes";
import { useAxios } from "../../hooks";
import { CountryForm, CountryFormData } from "./CountryForm";

export const AddCountryPage = () => {
  const navigate = useNavigate();

  const { sendRequest } = useAxios();

  const handleSubmit = (data: CountryFormData) => {
    const payload = {
      ...data,
    } satisfies CreateCountryDTO;

    sendRequest({
      url: API_ENDPOINTS.COUNTRIES,
      method: "post",
      data: payload,
    }).then(() => {
      navigate(ROUTES.COUNTRIES);
    });
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Create Country</h1>
      <CountryForm
        onSubmit={handleSubmit}
        onCancel={() => {
          navigate(ROUTES.COUNTRIES, { replace: true });
        }}
      />
    </div>
  );
};
