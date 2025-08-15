import { FormButtonsComponent } from "@codescape-financial/core-ui";
import {
  PortfolioResponseDTO,
  UpdatePortfolioDTO,
} from "@codescape-financial/portfolio-data-models";
import { FormEvent, useEffect, useState } from "react";
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

  const [formData, setFormData] = useState<PortfolioFormData | undefined>();

  useEffect(() => {
    if (portfolio) {
      setFormData({
        ...portfolio,
        description: portfolio.description ?? "",
      } satisfies PortfolioFormData);
    }
  }, [portfolio]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (portfolio && formData) {
      const payload: UpdatePortfolioDTO = {
        ...formData,
      };

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
      {formData && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-md border border-gray-300 p-6 shadow-sm"
        >
          <PortfolioForm value={formData} onChange={setFormData} />
          <FormButtonsComponent
            onCancel={() => navigate("/portfolios", { replace: true })}
          />
        </form>
      )}
    </DataPageContainer>
  );
};
