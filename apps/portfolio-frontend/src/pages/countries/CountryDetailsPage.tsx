import { Button } from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components/index.js";
import { useOutletContextData } from "../../hooks/index.js";

export const CountryDetailsPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: country,
    sendRequest,
  } = useOutletContextData<CountryResponseDTO>();

  const handleDelete = () => {
    if (country) {
      sendRequest({
        url: `/countries/${country.id}`,
        method: "delete",
      } satisfies AxiosRequestConfig);
      navigate("..", { replace: true });
    }
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {country && (
        <div className="mb-3 flex flex-row items-center justify-between gap-1">
          <h1
            className="me-auto w-full overflow-x-clip text-ellipsis whitespace-nowrap text-4xl font-extrabold"
            title={country.name}
          >
            {country.name}
          </h1>

          <Link to={`/countries/${country.id}/edit`}>
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
