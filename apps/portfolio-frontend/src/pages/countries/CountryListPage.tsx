import { Button, DataTable } from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  DataPageContainer,
  ViewCountryDetailsButton,
} from "../../components/index.js";
import { useAxios } from "../../hooks/index.js";
import { buildCountryTableSchema } from "../../utils/index.js";

export const CountryListPage = () => {
  const { loading, error, data, sendRequest } =
    useAxios<CountryResponseDTO[]>();

  useEffect(() => {
    sendRequest({ url: "/countries", method: "get" });
  }, [sendRequest]);

  const sortedCountries = useMemo(() => {
    if (!data) {
      return undefined;
    }
    const countryArray = [...data];
    countryArray.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );
    return countryArray;
  }, [data]);

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
          <DataTable<CountryResponseDTO>
            columns={buildCountryTableSchema({
              actionsComponent: (item) => (
                <ViewCountryDetailsButton country={item} />
              ),
            })}
            data={sortedCountries}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}
    </DataPageContainer>
  );
};
