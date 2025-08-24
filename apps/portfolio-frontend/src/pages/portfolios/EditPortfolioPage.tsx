import {
  PortfolioResponseDTO,
  UpdatePortfolioDTO,
} from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router-dom";
import { PortfolioAPI } from "../../api";
import { DataPageContainer } from "../../components";
import { ROUTES } from "../../config/routes";
import { useOutletContextData } from "../../hooks";
import { PortfolioForm, PortfolioFormData } from "./PortfolioForm";

export const EditPortfolioPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: portfolio,
    sendRequest,
  } = useOutletContextData<PortfolioResponseDTO>();

  const handleSubmit = (data: PortfolioFormData) => {
    if (portfolio && data) {
      const { name, description } = data;
      const payload: UpdatePortfolioDTO = { name };
      if (description) {
        payload.description = description;
      }

      const config = PortfolioAPI.getEditPortfolioConfig(portfolio.id, payload);
      sendRequest(config).then(() => {
        navigate(ROUTES.PORTFOLIOS);
      });
    }
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      <h1 className="mb-4 text-4xl font-extrabold">Update Portfolio</h1>
      {portfolio && (
        <PortfolioForm
          value={
            {
              ...portfolio,
              description: portfolio.description ?? "",
            } satisfies PortfolioFormData
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            navigate(ROUTES.PORTFOLIOS, { replace: true });
          }}
        />
      )}
    </DataPageContainer>
  );
};
