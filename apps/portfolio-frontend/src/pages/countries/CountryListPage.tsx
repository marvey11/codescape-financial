import { sortDataArray } from "@codescape-financial/core";
import { Button, DataTable } from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataPageContainer, ViewCountryDetailsButton } from "../../components";
import { useAxios } from "../../hooks";
import { buildCountryTableSchema } from "../../utils";

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
        <Link to="/countries/add">
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
  const columns = useMemo(
    () =>
      buildCountryTableSchema({
        actionsComponent: (item) => <ViewCountryDetailsButton country={item} />,
      }),
    [],
  );

  return (
    <DataTable<CountryResponseDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
