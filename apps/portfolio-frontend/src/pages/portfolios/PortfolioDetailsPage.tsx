import { sortDataArray } from "@codescape-financial/core";
import { DataTable } from "@codescape-financial/core-ui";
import {
  AllLatestQuotesTransformedDTO,
  PortfolioHoldingEmbeddedDTO,
  PortfolioResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axios";
import {
  AddOperationButton,
  DataPageContainer,
  DetailsPageHeader,
} from "../../components";
import { useAxios, useOutletContextData } from "../../hooks";
import { buildPortfolioHoldingColumnSchema } from "../../utils";

export const PortfolioDetailsPage = () => {
  const {
    loading,
    error,
    data: activePortfolioData,
  } = useOutletContextData<PortfolioResponseDTO>();

  const {
    data: historicalPortfolioData,
    sendRequest: sendHistoricalDataRequest,
  } = useAxios<PortfolioResponseDTO>();

  useEffect(() => {
    activePortfolioData &&
      sendHistoricalDataRequest({
        url: `/portfolios/${activePortfolioData.id}/historical`,
        method: "get",
      });
  }, [activePortfolioData, sendHistoricalDataRequest]);

  const sortedActiveHoldings = useMemo(
    () =>
      activePortfolioData?.holdings
        ? sortDataArray(activePortfolioData.holdings, (item) => item.stock.name)
        : undefined,
    [activePortfolioData?.holdings],
  );

  const sortedHistoricalHoldings = useMemo(
    () =>
      historicalPortfolioData?.holdings
        ? sortDataArray(
            historicalPortfolioData.holdings,
            (item) => item.stock.name,
          )
        : undefined,
    [historicalPortfolioData?.holdings],
  );

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {activePortfolioData && (
        <div className="flex flex-col gap-3">
          <DetailsPageHeader title={activePortfolioData.name} />

          {sortedActiveHoldings && sortedActiveHoldings.length > 0 ? (
            <>
              <h2 className="text-2xl font-extrabold">Active Holdings</h2>
              <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                <PortfolioActiveHoldingsTable
                  data={sortedActiveHoldings}
                  portfolioId={activePortfolioData.id}
                />
              </div>
            </>
          ) : (
            <span>No active holdings found for this portfolio.</span>
          )}

          {sortedHistoricalHoldings && sortedHistoricalHoldings.length > 0 ? (
            <>
              <h2 className="text-2xl font-extrabold">Historical Holdings</h2>
              <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                <PortfolioHistoricalHoldingsTable
                  data={sortedHistoricalHoldings}
                />
              </div>
            </>
          ) : (
            <span>
              No historical data found for holdings in this portfolio.
            </span>
          )}
        </div>
      )}
    </DataPageContainer>
  );
};

const PortfolioActiveHoldingsTable = ({
  data,
  portfolioId,
}: {
  data: PortfolioHoldingEmbeddedDTO[];
  portfolioId: string;
}) => {
  const [latestPrices, setLatestPrices] =
    useState<AllLatestQuotesTransformedDTO>({});

  useEffect(() => {
    const isins = data.map((holding) => holding.stock.isin);
    if (isins.length > 0) {
      axiosInstance
        .post<AllLatestQuotesTransformedDTO>(
          "/historical-quotes/latest-batch",
          {
            isins,
          },
        )
        .then((response) => {
          setLatestPrices(response.data);
        })
        .catch(console.error);
    }
  }, [data]);

  const columns = useMemo(
    () =>
      buildPortfolioHoldingColumnSchema(
        {
          actionsComponent: ({ data }) =>
            data ? (
              <AddOperationButton portfolioId={portfolioId} holding={data} />
            ) : (
              <></>
            ),
        },
        latestPrices,
      ),
    [latestPrices, portfolioId],
  );

  return (
    <DataTable<PortfolioHoldingEmbeddedDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};

const PortfolioHistoricalHoldingsTable = ({
  data,
}: {
  data: PortfolioHoldingEmbeddedDTO[];
}) => {
  const columns = useMemo(
    () =>
      buildPortfolioHoldingColumnSchema(
        {
          columnKeys: [
            "isin",
            "name",
            "realizedGains",
            "dividends",
            "totalGains",
          ],
        },
        {}, // latest prices are not needed for historical holding data
      ),
    [],
  );

  return (
    <DataTable<PortfolioHoldingEmbeddedDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
