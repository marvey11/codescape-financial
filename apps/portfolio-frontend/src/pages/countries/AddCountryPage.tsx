import { FormButtonsComponent } from "@codescape-financial/core-ui";
import { CreateCountryDTO } from "@codescape-financial/portfolio-data-models";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/index.js";
import { CountryForm, CountryFormData } from "./CountryForm.js";

export const AddCountryPage = () => {
  const navigate = useNavigate();

  const { sendRequest } = useAxios();

  const [formData, setFormData] = useState<CountryFormData>({
    name: "",
    countryCode: "",
    withholdingTaxRate: 0,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: CreateCountryDTO = {
      ...formData,
    };
    console.log(payload);
    sendRequest({ url: "/countries", method: "post", data: payload }).then(() =>
      navigate("/countries"),
    );
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Create Country</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-md border border-gray-300 p-6 shadow-sm"
      >
        <CountryForm value={formData} onChange={setFormData} />
        <FormButtonsComponent
          onCancel={() => navigate("..", { replace: true })}
        />
      </form>
    </div>
  );
};
