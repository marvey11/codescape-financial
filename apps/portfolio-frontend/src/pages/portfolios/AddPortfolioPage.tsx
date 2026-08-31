import { CreatePortfolioDTO } from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router";
import { PortfolioAPI } from "../../api";
import { ROUTES } from "../../config/routes";
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

    const config = PortfolioAPI.getAddPortfolioConfig(payload);
    sendRequest(config).then(() => {
      navigate(ROUTES.PORTFOLIOS);
    });
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Create Portfolio</h1>
      <PortfolioForm
        onSubmit={handleSubmit}
        onCancel={() => {
          navigate(ROUTES.PORTFOLIOS, { replace: true });
        }}
      />
    </div>
  );
};
