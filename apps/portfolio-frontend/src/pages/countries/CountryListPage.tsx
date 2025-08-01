import { formatPercent } from "@codescape-financial/core";
import { Button } from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DetailsActionButton } from "../../components/ActionButton.js";
import { DataPageContainer } from "../../components/index.js";
import { useAxios } from "../../hooks/index.js";

export const CountryListPage = () => {
  const navigate = useNavigate();

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
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-50 text-sm uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Withholding Tax Rate
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {sortedCountries.map((country) => (
                <tr
                  key={country.id}
                  className="border-b bg-white hover:bg-gray-100"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                  >
                    {country.name}
                  </th>
                  <td className="px-6 py-4 font-mono">{country.countryCode}</td>
                  <td className="px-6 py-4">
                    {formatPercent(country.withholdingTaxRate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DetailsActionButton
                      aria-label={`Show details for ${country.name}`}
                      onClick={() => {
                        navigate(`/countries/${country.id}`);
                      }}
                    >
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </DetailsActionButton>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="bg-gray-50 text-sm uppercase text-gray-700">
              <tr>
                <td className="px-6 py-3 text-right" colSpan={4}>
                  {sortedCountries.length} rows
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </DataPageContainer>
  );
};
