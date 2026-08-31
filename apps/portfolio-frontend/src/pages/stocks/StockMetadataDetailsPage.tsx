import { Tag } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useNavigate } from "react-router";
import { StockMetadataAPI } from "../../api";
import { DataPageContainer, DetailsPageHeader } from "../../components";
import {
  DetailsPageDeleteButton,
  DetailsPageEditButton,
} from "../../components/default-buttons";
import { ROUTES } from "../../config/routes";
import { useOutletContextData } from "../../hooks";
import { buildEditStockRoute } from "../../utils";

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
      const config = StockMetadataAPI.getDeleteStockConfig(stock.id);
      sendRequest(config).then(() => {
        navigate(ROUTES.STOCKS);
      });
    }
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {stock && (
        <div className="flex flex-col gap-3">
          <DetailsPageHeader
            title={`${stock.name} — Stock Details`}
            extraComponents={[
              <DetailsPageEditButton
                key={`${stock.id}-edit-button}`}
                editPath={buildEditStockRoute(stock.id)}
              />,
              <DetailsPageDeleteButton
                key={`${stock.id}-delete-button}`}
                onDelete={handleDelete}
              />,
            ]}
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
