import { CreateCountryDTO } from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks";
import { CountryForm, CountryFormData } from "./CountryForm";

export const AddCountryPage = () => {
  const navigate = useNavigate();

  const { sendRequest } = useAxios();

  const handleSubmit = (data: CountryFormData) => {
    const payload: CreateCountryDTO = {
      ...data,
    };
    sendRequest({ url: "/countries", method: "post", data: payload }).then(
      () => {
        navigate("/countries");
      },
    );
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Create Country</h1>
      <CountryForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("..", { replace: true })}
      />
    </div>
  );
};
