import {
  PortfolioResponseDTO,
  UpdateCountryDTO,
} from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components";
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
      const payload = Object.assign(
        { name },
        description && { description },
      ) satisfies UpdateCountryDTO;

      sendRequest({
        url: `/portfolios/${portfolio.id}`,
        method: "put",
        data: payload,
      }).then(() => {
        navigate("/portfolios");
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
          onCancel={() => navigate("..", { replace: true })}
        />
      )}
    </DataPageContainer>
  );
};
