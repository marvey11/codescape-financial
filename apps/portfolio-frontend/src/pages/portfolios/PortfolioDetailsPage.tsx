import { sortDataArray } from "@codescape-financial/core";
import { Checkbox, DataTable } from "@codescape-financial/core-ui";
import {
  AllLatestQuotesTransformedDTO,
  PortfolioHoldingEmbeddedDTO,
  PortfolioResponseDTO,
  PortfolioViewFilterDTO,
  XIRRHoldingBatchTransformedDTO,
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
    useState<XIRRHoldingBatchTransformedDTO>({});

  const [fullPortfolioXIRR, setFullPortfolioXIRR] =
    useState<XIRRPortfolioTransformedDTO | null>(null);
  const [activePortfolioXIRR, setActivePortfolioXIRR] =
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
      const xirrBatchRequest =
        axiosInstance.post<XIRRHoldingBatchTransformedDTO>(
          `/portfolios/${portfolioId}/holdings/xirr-batch`,
          { isins },
        );

      Promise.all([quotesRequest, xirrBatchRequest])
        .then(([latestQuotesResponse, xirrResponse]) => {
          setlatestQuotes((prev) => {
            for (const [isin, quote] of Object.entries(
              latestQuotesResponse.data,
            )) {
              prev.set(isin, quote);
            }
            return prev;
          });
          setHoldingsXIRR(xirrResponse.data);
        })
        .catch(console.error);
    }
  }, [data]);

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

    const isins = filteredHoldings.map((holding) => holding.stock.isin);

    const requestNeeded = showActiveHoldingsOnly
      ? !activePortfolioXIRR
      : !fullPortfolioXIRR;

    if (requestNeeded) {
      axiosInstance
        .request<XIRRPortfolioTransformedDTO>({
          url: `/portfolios/${data?.id}/xirr`,
          params: {
            activeOnly: isins.length !== data?.holdings.length,
          } satisfies PortfolioViewFilterDTO,
          method: "GET",
        })
        .then((response) => {
          if (showActiveHoldingsOnly) {
            setActivePortfolioXIRR(response.data);
          } else {
            setFullPortfolioXIRR(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [filteredHoldings]);

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
                  portfolioXIRR={
                    (showActiveHoldingsOnly
                      ? activePortfolioXIRR
                      : fullPortfolioXIRR
                    )?.xirr
                  }
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
  holdingsXIRR: XIRRHoldingBatchTransformedDTO;
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
          ) : (
            <></>
          ),
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
