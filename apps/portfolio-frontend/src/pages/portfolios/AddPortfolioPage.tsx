import { FormButtonsComponent } from "@codescape-financial/core-ui";
import { CreatePortfolioDTO } from "@codescape-financial/portfolio-data-models";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks";
import { PortfolioForm, PortfolioFormData } from "./PortfolioForm";

export const AddPortfolioPage = () => {
  const navigate = useNavigate();

  const { sendRequest } = useAxios();

  const [formData, setFormData] = useState<PortfolioFormData>({
    name: "",
    description: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: CreatePortfolioDTO = {
      ...formData,
    };
    sendRequest({ url: "/countries", method: "post", data: payload }).then(
      () => {
        navigate("/countries");
      },
    );
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Create Portfolio</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-md border border-gray-300 p-6 shadow-sm"
      >
        <PortfolioForm value={formData} onChange={setFormData} />
        <FormButtonsComponent
          onCancel={() => navigate("/portfolios", { replace: true })}
        />
      </form>
    </div>
  );
};
