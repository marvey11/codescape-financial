import { sortDataArray } from "@codescape-financial/core";
import { Button, DataTable } from "@codescape-financial/core-ui";
import { PortfolioResponseDTO } from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  DataPageContainer,
  ViewPortfolioDetailsButton,
} from "../../components";
import { useAxios } from "../../hooks";
import { buildPortfolioTableSchema } from "../../utils";

export const PortfolioListPage = () => {
  const { loading, error, data, sendRequest } =
    useAxios<PortfolioResponseDTO[]>();

  useEffect(() => {
    sendRequest({ url: "/portfolios", method: "get" });
  }, [sendRequest]);

  const sortedPortfolios = useMemo(
    () => (data ? sortDataArray(data, "name") : undefined),
    [data],
  );

  return (
    <DataPageContainer isLoading={loading} error={error}>
      <span className="mb-3 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-extrabold">Portfolio List</h1>
        <Link to="/portfolios/add">
          <Button>Add Portfolio</Button>
        </Link>
      </span>

      {sortedPortfolios && (
        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
          <PortfolioTable data={sortedPortfolios} />
        </div>
      )}
    </DataPageContainer>
  );
};

const PortfolioTable = ({ data }: { data: PortfolioResponseDTO[] }) => {
  const columns = useMemo(
    () =>
      buildPortfolioTableSchema({
        actionsComponent: (item) => (
          <ViewPortfolioDetailsButton portfolio={item} />
        ),
      }),
    [],
  );

  return (
    <DataTable<PortfolioResponseDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
