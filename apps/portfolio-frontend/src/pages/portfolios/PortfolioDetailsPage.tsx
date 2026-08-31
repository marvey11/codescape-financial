import { PortfolioViewType, sortDataArray } from "@codescape-financial/core";
import { Checkbox, DataTable } from "@codescape-financial/core-ui";
import {
  AllLatestQuotesTransformedDTO,
  AllocationTransformedDTO,
  PortfolioHoldingEmbeddedDTO,
  PortfolioResponseDTO,
  XIRRHoldingListTransformedDTO,
  XIRRPortfolioTransformedDTO,
} from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ResponsiveContainer } from "recharts";
import {
  HistoricalQuoteAPI,
  PortfolioAPI,
  PortfolioHoldingAPI,
} from "../../api";
import axiosInstance from "../../api/axios";
import { DataPageContainer, DetailsPageHeader } from "../../components";
import {
  ActionMenu,
  AddOperationButton,
  ViewDetailsActionButton,
} from "../../components/action-buttons";
import {
  CountryAllocationPieChart,
  StockAllocationPieChart,
} from "../../components/charts";
import {
  AllocationTreemapItem,
  StockAllocationTreemap,
} from "../../components/charts/StockAllocationTreeMap";
import { DetailsPageEditButton } from "../../components/default-buttons";
import { LOCAL_STORAGE_KEYS } from "../../config/local-storage-keys";
import { useLocalStorage, useOutletContextData } from "../../hooks";
import {
  LatestQuoteMapping,
  QuoteObject,
  XIRRMapping,
  XIRRObject,
} from "../../types";
import {
  buildPortfolioHoldingColumnSchema,
  buildPortfolioHoldingDetailsRoute,
} from "../../utils";

/**
 * Renders the portfolio details page, which displays information about a specific portfolio,
 * including its holdings.
 */
export const PortfolioDetailsPage = () => {
  const { loading, error, data } = useOutletContextData<PortfolioResponseDTO>();

  const [showActiveHoldingsOnly, setShowActiveHoldingsOnly] = useLocalStorage(
    LOCAL_STORAGE_KEYS.PORTFOLIO_DETAILS_SHOW_ACTIVE_HOLDINGS_ONLY,
    true,
  );

  const [latestQuotes, setlatestQuotes] = useState<LatestQuoteMapping>(
    new Map<string, QuoteObject>(),
  );
  const [holdingsXIRR, setHoldingsXIRR] = useState<XIRRMapping>(
    new Map<string, XIRRObject>(),
  );
  const [portfolioXIRR, setPortfolioXIRR] =
    useState<XIRRPortfolioTransformedDTO | null>(null);

  const [allocationData, setAllocationData] =
    useState<AllocationTransformedDTO>();

  useEffect(() => {
    if (data == null) {
      return;
    }

    const portfolioId = data.id;
    const isins = data.holdings.map((holding) => holding.stock.isin);
    if (isins.length === 0) {
      return;
    }

    const viewType: PortfolioViewType = showActiveHoldingsOnly
      ? "active"
      : "all";

    const latestQuotesConfig = HistoricalQuoteAPI.getLatestQuotesBatchConfig({
      isins,
    });
    const quotesRequest =
      axiosInstance.request<AllLatestQuotesTransformedDTO>(latestQuotesConfig);

    const xirrHoldingListRequestConfig =
      PortfolioHoldingAPI.getHoldingListXIRRConfig(portfolioId, viewType);
    const xirrHoldingListRequest =
      axiosInstance.request<XIRRHoldingListTransformedDTO>(
        xirrHoldingListRequestConfig,
      );

    const portfolioXirrRequestConfig = PortfolioAPI.getPortfolioXirrConfig(
      portfolioId,
      viewType,
    );
    const portfolioXirrRequest =
      axiosInstance.request<XIRRPortfolioTransformedDTO>(
        portfolioXirrRequestConfig,
      );

    const getAllocationConfig =
      PortfolioAPI.getPortfolioAllocationsConfig(portfolioId);
    const allocationsRequest =
      axiosInstance.request<AllocationTransformedDTO>(getAllocationConfig);

    Promise.all([
      quotesRequest,
      xirrHoldingListRequest,
      portfolioXirrRequest,
      allocationsRequest,
    ])
      .then(
        ([
          latestQuotesResponse,
          xirrHoldingListResponse,
          portfolioXirrResponse,
          allocationsResponse,
        ]) => {
          setlatestQuotes(
            new Map(Object.entries(latestQuotesResponse.data ?? {})),
          );
          setHoldingsXIRR(
            new Map(Object.entries(xirrHoldingListResponse.data ?? {})),
          );
          setPortfolioXIRR(portfolioXirrResponse.data);
          setAllocationData(allocationsResponse.data);
        },
      )
      .catch(console.error);
  }, [data, showActiveHoldingsOnly]);

  const holdings = data?.holdings;
  const filteredHoldings = useMemo(() => {
    if (!holdings) {
      return undefined;
    }

    return showActiveHoldingsOnly
      ? holdings.filter(
          ({ summary: { totalShares } }) =>
            typeof totalShares === "number" && totalShares > 0,
        )
      : holdings;
  }, [holdings, showActiveHoldingsOnly]);

  const holdingsByName = useMemo(
    () =>
      filteredHoldings
        ? sortDataArray(filteredHoldings, (item) => item.stock.name)
        : undefined,
    [filteredHoldings],
  );

  const treemapData = useMemo(() => {
    // splice the XIRR values into the allocation data
    const tempData = [...(allocationData?.assetAllocation ?? [])].map(
      (asset) =>
        ({
          ...asset,
          xirr: holdingsXIRR.get(asset.isin)?.xirr,
        }) as AllocationTreemapItem,
    );

    // sort the data by holding size in descending order
    tempData.sort((a, b) => b.value - a.value);

    return tempData;
  }, [allocationData?.assetAllocation, holdingsXIRR]);

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

          {holdingsByName && holdingsByName.length > 0 ? (
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
                  data={holdingsByName}
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

          <h2 className="text-2xl font-extrabold">Allocations</h2>
          <div className="z-10 flex w-full flex-row items-center justify-between gap-2">
            {allocationData && (
              <>
                <div className="h-full w-full rounded-md border border-gray-400">
                  {/* IMPORTANT: need to specify a surrounding container with a dimension */}
                  <ResponsiveContainer width="100%" height={600}>
                    <StockAllocationPieChart
                      portfolioId={allocationData.portfolioId}
                      date={allocationData.date}
                      assetAllocation={allocationData.assetAllocation}
                    />
                  </ResponsiveContainer>
                </div>
                <div className="h-full w-full rounded-md border border-gray-400">
                  {/* IMPORTANT: need to specify a surrounding container with a dimension */}
                  <ResponsiveContainer width="100%" height={600}>
                    <CountryAllocationPieChart
                      portfolioId={allocationData.portfolioId}
                      date={allocationData.date}
                      countryAllocation={allocationData.countryAllocation}
                    />
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>

          <div className="w-full">
            {allocationData && (
              <ResponsiveContainer width="100%" height={600}>
                <StockAllocationTreemap
                  portfolioId={allocationData.portfolioId}
                  date={allocationData.date}
                  assetAllocation={treemapData}
                />
              </ResponsiveContainer>
            )}
          </div>
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
 *
 * @param {PortfolioHoldingsTableProps} props - The props for the component.
 */
const PortfolioHoldingsTable = ({
  portfolioId,
  latestQuotes,
  holdingsXIRR,
  portfolioXIRR,
  data,
}: PortfolioHoldingsTableProps) => {
  const columns = useMemo(
    () =>
      buildPortfolioHoldingColumnSchema(
        {
          actionsComponent: ({ data }) =>
            data ? (
              <HoldingActions data={data} portfolioId={portfolioId} />
            ) : null,
        },
        latestQuotes,
        holdingsXIRR,
        portfolioXIRR,
      ),
    [latestQuotes, holdingsXIRR, portfolioXIRR, portfolioId],
  );

  return (
    <DataTable<PortfolioHoldingEmbeddedDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};

/**
 * Props for the HoldingActions component.
 */
interface HoldingActionsProps {
  portfolioId: string;
  data: PortfolioHoldingEmbeddedDTO;
}

/**
 * Renders the actions for a portfolio holding.
 *
 * @param {HoldingActionsProps} props - The props for the component.
 */
const HoldingActions = ({ portfolioId, data }: HoldingActionsProps) => {
  const navigate = useNavigate();

  return (
    <ActionMenu>
      <ViewDetailsActionButton
        label={`Show details for holding ${data.stock.name}`}
        onClick={() => {
          navigate(buildPortfolioHoldingDetailsRoute(portfolioId, data.id));
        }}
      />
      <AddOperationButton portfolioId={portfolioId} holding={data} />
    </ActionMenu>
  );
};
