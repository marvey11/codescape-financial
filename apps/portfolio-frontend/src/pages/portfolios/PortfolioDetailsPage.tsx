import { sortDataArray } from "@codescape-financial/core";
import { Checkbox, DataTable } from "@codescape-financial/core-ui";
import {
  AllLatestQuotesTransformedDTO,
  PortfolioHoldingEmbeddedDTO,
  PortfolioResponseDTO,
  PortfolioViewFilterDTO,
  XIRRHoldingListTransformedDTO,
  XIRRPortfolioTransformedDTO,
} from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axios";
import {
  AddOperationButton,
  DataPageContainer,
  DetailsPageHeader,
} from "../../components";
import { DetailsPageEditButton } from "../../components/default-buttons";
import { useOutletContextData } from "../../hooks";
import { LatestQuoteMapping, QuoteObject } from "../../types";
import { buildPortfolioHoldingColumnSchema } from "../../utils";

export const PortfolioDetailsPage = () => {
  const { loading, error, data } = useOutletContextData<PortfolioResponseDTO>();

  const [showActiveHoldingsOnly, setShowActiveHoldingsOnly] = useState(true);

  const [latestQuotes, setlatestQuotes] = useState<LatestQuoteMapping>(
    new Map<string, QuoteObject>(),
  );
  const [holdingsXIRR, setHoldingsXIRR] =
    useState<XIRRHoldingListTransformedDTO>({});
  const [portfolioXIRR, setPortfolioXIRR] =
    useState<XIRRPortfolioTransformedDTO | null>(null);

  useEffect(() => {
    if (data == null) {
      return;
    }

    const portfolioId = data.id;
    const isins = data.holdings.map((holding) => holding.stock.isin);
    if (isins.length) {
      const quotesRequest = axiosInstance.post<AllLatestQuotesTransformedDTO>(
        "/historical-quotes/latest-batch",
        { isins },
      );
      const xirrHoldingListRequest =
        axiosInstance.request<XIRRHoldingListTransformedDTO>({
          url: `/portfolios/${portfolioId}/holdings/xirr`,
          params: {
            viewType: showActiveHoldingsOnly ? "active" : "all",
          } satisfies PortfolioViewFilterDTO,
          method: "GET",
        });

      Promise.all([quotesRequest, xirrHoldingListRequest])
        .then(([latestQuotesResponse, xirrResponse]) => {
          setlatestQuotes((prev) => {
            for (const [isin, quote] of Object.entries(
              latestQuotesResponse.data,
            )) {
              prev.set(isin, quote);
            }
            return prev;
          });
          console.log(xirrResponse.data);
          setHoldingsXIRR(xirrResponse.data);
        })
        .catch(console.error);
    }
  }, [data, data?.id, showActiveHoldingsOnly]);

  const filteredHoldings = useMemo(() => {
    if (!data?.holdings) {
      return undefined;
    }

    return showActiveHoldingsOnly
      ? data.holdings.filter(
          ({ summary: { totalShares } }) =>
            typeof totalShares === "number" && totalShares > 0,
        )
      : data.holdings;
  }, [data?.holdings, showActiveHoldingsOnly]);

  const sortedHoldings = useMemo(
    () =>
      filteredHoldings
        ? sortDataArray(filteredHoldings, (item) => item.stock.name)
        : undefined,
    [filteredHoldings],
  );

  useEffect(() => {
    if (!filteredHoldings) {
      return;
    }

    axiosInstance
      .request<XIRRPortfolioTransformedDTO>({
        url: `/portfolios/${data?.id}/xirr`,
        params: {
          viewType: showActiveHoldingsOnly ? "active" : "all",
        } satisfies PortfolioViewFilterDTO,
        method: "GET",
      })
      .then((response) => {
        setPortfolioXIRR(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [data?.id, filteredHoldings, showActiveHoldingsOnly]);

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {data && (
        <div className="flex flex-col gap-3">
          <DetailsPageHeader
            title={data.name}
            extraComponents={[
              // need to provide `key` parameters
              <DetailsPageEditButton
                key={`${data.id}-edit-button}`}
                editPath={`/portfolios/${data.id}/edit`}
              />,
            ]}
          />

          {sortedHoldings && sortedHoldings.length > 0 ? (
            <>
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-extrabold">Holdings</h2>
                <Checkbox
                  label="Show Active Holdings Only"
                  checked={showActiveHoldingsOnly}
                  onChange={(e) => setShowActiveHoldingsOnly(e.target.checked)}
                />
              </div>
              <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                <PortfolioHoldingsTable
                  data={sortedHoldings}
                  latestQuotes={latestQuotes}
                  holdingsXIRR={holdingsXIRR}
                  portfolioXIRR={portfolioXIRR?.xirr}
                  portfolioId={data.id}
                />
              </div>
            </>
          ) : (
            <span>No holdings found for this portfolio.</span>
          )}
        </div>
      )}
    </DataPageContainer>
  );
};

interface PortfolioHoldingsTableProps {
  portfolioId: string;
  latestQuotes: LatestQuoteMapping;
  holdingsXIRR: XIRRHoldingListTransformedDTO;
  portfolioXIRR: number | undefined;
  data: PortfolioHoldingEmbeddedDTO[];
}

const PortfolioHoldingsTable = ({
  portfolioId,
  latestQuotes,
  holdingsXIRR,
  portfolioXIRR,
  data,
}: PortfolioHoldingsTableProps) => {
  const columns = useMemo(() => {
    return buildPortfolioHoldingColumnSchema(
      {
        actionsComponent: ({ data }) =>
          data ? (
            <AddOperationButton portfolioId={portfolioId} holding={data} />
          ) : null,
      },
      latestQuotes,
      holdingsXIRR,
      portfolioXIRR,
    );
  }, [portfolioId, holdingsXIRR, latestQuotes, portfolioXIRR]);

  return (
    <DataTable<PortfolioHoldingEmbeddedDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
