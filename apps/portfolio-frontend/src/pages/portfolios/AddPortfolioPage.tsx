import { CreatePortfolioDTO } from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks";
import { PortfolioForm, PortfolioFormData } from "./PortfolioForm";

export const AddPortfolioPage = () => {
  const navigate = useNavigate();

  const { sendRequest } = useAxios();

  const handleSubmit = (data: PortfolioFormData) => {
    const { name, description } = data;
    const payload = Object.assign(
      { name },
      description && { description },
    ) satisfies CreatePortfolioDTO;

    sendRequest({ url: "/portfolios", method: "post", data: payload }).then(
      () => {
        navigate("/portfolios");
      },
    );
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Create Portfolio</h1>
      <PortfolioForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("..", { replace: true })}
      />
    </div>
  );
};
