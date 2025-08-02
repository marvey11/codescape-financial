import { Tag } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import {
  DataPageContainer,
  DetailsPageHeader,
} from "../../components/index.js";
import { useOutletContextData } from "../../hooks/index.js";

export const StockMetadataDetailsPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: stock,
    sendRequest,
  } = useOutletContextData<StockResponseDTO>();

  const handleDelete = () => {
    if (stock) {
      sendRequest({
        url: `/stock-metadata/${stock.id}`,
        method: "delete",
      } satisfies AxiosRequestConfig);
      navigate("/stocks");
    }
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {stock && (
        <div className="flex flex-col gap-3">
          <DetailsPageHeader
            title={stock.name}
            editPath={`/stocks/${stock.id}/edit`}
            onDelete={handleDelete}
          >
            <StockTags stock={stock} />
          </DetailsPageHeader>
        </div>
      )}
    </DataPageContainer>
  );
};

const StockTags = ({ stock }: { stock: StockResponseDTO }) => (
  <>
    <Tag title="ISIN" className="font-mono">
      {stock.isin}
    </Tag>
    <Tag title="NSIN" className="font-mono">
      {stock.nsin}
    </Tag>
    <Tag variant="primary" title={stock.country.name}>
      {stock.country.countryCode}
    </Tag>
    <Tag title="Currency" className="font-mono">
      {stock.currency}
    </Tag>
  </>
);
