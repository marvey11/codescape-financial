import { sortDataArray } from "@codescape-financial/core";
import { Checkbox, DataTable } from "@codescape-financial/core-ui";
import {
  AllLatestQuotesTransformedDTO,
  PortfolioHoldingEmbeddedDTO,
  PortfolioResponseDTO,
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
import { buildPortfolioHoldingColumnSchema } from "../../utils";

export const PortfolioDetailsPage = () => {
  const { loading, error, data } = useOutletContextData<PortfolioResponseDTO>();

  const [showActiveHoldingsOnly, setShowActiveHoldingsOnly] = useState(true);

  const processedHoldings = useMemo(() => {
    if (!data?.holdings) {
      return undefined;
    }

    const filteredHoldings = showActiveHoldingsOnly
      ? data.holdings.filter(
          ({ summary: { totalShares } }) =>
            typeof totalShares === "number" && totalShares > 0,
        )
      : data.holdings;

    return sortDataArray(filteredHoldings, (item) => item.stock.name);
  }, [data?.holdings, showActiveHoldingsOnly]);

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

          {processedHoldings && processedHoldings.length > 0 ? (
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
                  data={processedHoldings}
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

const PortfolioHoldingsTable = ({
  data,
  portfolioId,
}: {
  data: PortfolioHoldingEmbeddedDTO[];
  portfolioId: string;
}) => {
  const [latestPrices, setLatestPrices] =
    useState<AllLatestQuotesTransformedDTO>({});
  const [latestBatchXIRR, setLatestBatchXIRR] =
    useState<XIRRHoldingBatchTransformedDTO>({});
  const [portfolioXIRR, setPortfolioXIRR] =
    useState<XIRRPortfolioTransformedDTO | null>(null);

  useEffect(() => {
    const isins = data.map((holding) => holding.stock.isin);

    const quoteRequest = axiosInstance.post<AllLatestQuotesTransformedDTO>(
      "/historical-quotes/latest-batch",
      { isins },
    );

    const xirrBatchRequest = axiosInstance.post<XIRRHoldingBatchTransformedDTO>(
      `/portfolios/${portfolioId}/holdings/xirr-batch`,
      { isins },
    );

    const xirrPortfolioRequest =
      axiosInstance.post<XIRRPortfolioTransformedDTO>(
        `/portfolios/${portfolioId}/xirr-batch`,
        { isins },
      );

    if (isins.length > 0) {
      Promise.all([quoteRequest, xirrBatchRequest, xirrPortfolioRequest])
        .then(([quoteResponse, xirrResponse, xirrPortfolioResponse]) => {
          setLatestPrices(quoteResponse.data);
          setLatestBatchXIRR(xirrResponse.data);
          setPortfolioXIRR(xirrPortfolioResponse.data);
        })
        .catch(console.error);
    }
  }, [data]);

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
      latestPrices,
      latestBatchXIRR,
      portfolioXIRR,
    );
  }, [portfolioId, latestBatchXIRR, latestPrices, portfolioXIRR]);

  return (
    <DataTable<PortfolioHoldingEmbeddedDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
