import { formatPercent } from "@codescape-financial/core";
import {
  ActionButton,
  Button,
  ColumnSchema,
  DataTable,
} from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataPageContainer } from "../../components/index.js";
import { useAxios } from "../../hooks/index.js";

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
            columns={countryTableSchema}
            data={sortedCountries}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}
    </DataPageContainer>
  );
};

const ViewCountryDetailsButton = ({
  country,
}: {
  country: CountryResponseDTO;
}) => {
  const navigate = useNavigate();
  return (
    <ActionButton
      aria-label={`Show details for ${country.name}`}
      onClick={() => {
        navigate(`/countries/${country.id}`);
      }}
    >
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </ActionButton>
  );
};

const countryTableSchema: ColumnSchema<CountryResponseDTO>[] = [
  {
    header: "Name",
    value: (item) => item.name,
  },
  {
    header: "Code",
    value: (item) => item.countryCode,
  },
  {
    header: "Withholding Tax Rate",
    value: (item) => formatPercent(item.withholdingTaxRate),
  },
  {
    header: undefined,
    value: (item) => <ViewCountryDetailsButton country={item} />,
    headerClassNames: "text-right",
    cellClassNames: "text-right",
    footer: (data) => `${data.length} rows`,
    footerClassNames: "text-right uppercase",
  },
];
