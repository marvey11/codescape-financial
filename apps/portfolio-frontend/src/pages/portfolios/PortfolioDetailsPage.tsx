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
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import {
  ActionMenu,
  AddOperationButton,
  DataPageContainer,
  DetailsPageHeader,
  ViewDetailsActionButton,
} from "../../components";
import { DetailsPageEditButton } from "../../components/default-buttons";
import { useOutletContextData } from "../../hooks";
import {
  LatestQuoteMapping,
  QuoteObject,
  XIRRMapping,
  XIRRObject,
} from "../../types";
import { buildPortfolioHoldingColumnSchema } from "../../utils";

/**
 * Renders the portfolio details page, which displays information about a specific portfolio,
 * including its holdings.
 */
export const PortfolioDetailsPage = () => {
  const { loading, error, data } = useOutletContextData<PortfolioResponseDTO>();

  const [showActiveHoldingsOnly, setShowActiveHoldingsOnly] = useState(true);

  const [latestQuotes, setlatestQuotes] = useState<LatestQuoteMapping>(
    new Map<string, QuoteObject>(),
  );
  const [holdingsXIRR, setHoldingsXIRR] = useState<XIRRMapping>(
    new Map<string, XIRRObject>(),
  );
  const [portfolioXIRR, setPortfolioXIRR] =
    useState<XIRRPortfolioTransformedDTO | null>(null);

  useEffect(() => {
    if (data == null) {
      return;
    }

    const portfolioId = data.id;
    const isins = data.holdings.map((holding) => holding.stock.isin);
    if (isins.length === 0) {
      return;
    }

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

    const portfolioXirrRequest =
      axiosInstance.request<XIRRPortfolioTransformedDTO>({
        url: `/portfolios/${portfolioId}/xirr`,
        params: {
          viewType: showActiveHoldingsOnly ? "active" : "all",
        } satisfies PortfolioViewFilterDTO,
        method: "GET",
      });

    Promise.all([quotesRequest, xirrHoldingListRequest, portfolioXirrRequest])
      .then(
        ([
          latestQuotesResponse,
          xirrHoldingListResponse,
          portfolioXirrResponse,
        ]) => {
          setlatestQuotes(
            new Map(Object.entries(latestQuotesResponse.data ?? {})),
          );
          setHoldingsXIRR(
            new Map(Object.entries(xirrHoldingListResponse.data ?? {})),
          );
          setPortfolioXIRR(portfolioXirrResponse.data);
        },
      )
      .catch(console.error);
  }, [data, showActiveHoldingsOnly]);

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

/**
 * Props for the PortfolioHoldingsTable component.
 */
interface PortfolioHoldingsTableProps {
  /** The ID of the portfolio. */
  portfolioId: string;
  /** A map of the latest quotes for each holding. */
  latestQuotes: LatestQuoteMapping;
  /** A map of the XIRR for each holding. */
  holdingsXIRR: XIRRMapping;
  /** The XIRR of the entire portfolio. */
  portfolioXIRR: number | undefined;
  /** The holdings to display in the table. */
  data: PortfolioHoldingEmbeddedDTO[];
}

/**
 * Renders a table of portfolio holdings.
 * @param {PortfolioHoldingsTableProps} props - The props for the component.
 */
const PortfolioHoldingsTable = ({
  portfolioId,
  latestQuotes,
  holdingsXIRR,
  portfolioXIRR,
  data,
}: PortfolioHoldingsTableProps) => {
  const navigate = useNavigate();

  const columns = useMemo(() => {
    return buildPortfolioHoldingColumnSchema(
      {
        actionsComponent: ({ data }) =>
          data ? (
            <ActionMenu>
              <ViewDetailsActionButton
                label={`Show details for holding ${data.stock.name}`}
                onClick={() => {
                  navigate(`/portfolios/${portfolioId}/holdings/${data.id}`);
                }}
              />
              <AddOperationButton portfolioId={portfolioId} holding={data} />
            </ActionMenu>
          ) : null,
      },
      latestQuotes,
      holdingsXIRR,
      portfolioXIRR,
    );
  }, [latestQuotes, holdingsXIRR, portfolioXIRR, portfolioId, navigate]);

  return (
    <DataTable<PortfolioHoldingEmbeddedDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
