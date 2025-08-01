import { Button } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components/index.js";
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
      navigate("..", { replace: true });
    }
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {stock && (
        <div className="mb-3 flex flex-row items-center justify-between gap-1">
          <h1
            className="me-auto w-full overflow-x-clip text-ellipsis whitespace-nowrap text-4xl font-extrabold"
            title={stock.name}
          >
            {stock.name}
          </h1>

          <Link to={`/stocks/${stock.id}/edit`}>
            <Button>Edit</Button>
          </Link>

          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </div>
      )}
    </DataPageContainer>
  );
};
