import { sortDataArray } from "@codescape-financial/core";
import { Button, DataTable } from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components";
import { ViewDetailsActionButton } from "../../components/action-buttons";
import { ROUTES } from "../../config/routes";
import { useAxios } from "../../hooks";
import { buildCountryDetailsRoute } from "../../utils";
import { buildCountryColumnSchema } from "../../utils/table-schemas";

export const CountryListPage = () => {
  const { loading, error, data, sendRequest } =
    useAxios<CountryResponseDTO[]>();

  useEffect(() => {
    sendRequest({ url: "/countries", method: "get" });
  }, [sendRequest]);

  const sortedCountries = useMemo(
    () => (data ? sortDataArray(data, "name") : undefined),
    [data],
  );

  return (
    <DataPageContainer isLoading={loading} error={error}>
      <span className="mb-3 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-extrabold">Country List</h1>
        <Link to={ROUTES.ADD_COUNTRY}>
          <Button>Add Country</Button>
        </Link>
      </span>

      {sortedCountries && (
        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
          <CountryTable data={sortedCountries} />
        </div>
      )}
    </DataPageContainer>
  );
};

const CountryTable = ({ data }: { data: CountryResponseDTO[] }) => {
  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      buildCountryColumnSchema({
        actionsComponent: ({ data }) =>
          data ? (
            <ViewDetailsActionButton
              label={`Show details for ${data.name}`}
              onClick={() => {
                navigate(buildCountryDetailsRoute(data.id));
              }}
            />
          ) : null,
      }),
    [navigate],
  );

  return (
    <DataTable columns={columns} data={data} keyExtractor={(item) => item.id} />
  );
};
