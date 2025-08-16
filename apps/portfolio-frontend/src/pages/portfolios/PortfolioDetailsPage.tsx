import { formatPercent, sortDataArray } from "@codescape-financial/core";
import { Checkbox, DataTable } from "@codescape-financial/core-ui";
import {
  AllLatestQuotesTransformedDTO,
  AllocationTransformedDTO,
  PortfolioHoldingEmbeddedDTO,
  PortfolioResponseDTO,
  PortfolioViewFilterDTO,
  XIRRHoldingListTransformedDTO,
  XIRRPortfolioTransformedDTO,
} from "@codescape-financial/portfolio-data-models";
import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axios";
import {
  AddOperationButton,
  DataPageContainer,
  DetailsPageHeader,
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

    const allocationsRequest = axiosInstance.request<AllocationTransformedDTO>({
      url: `/portfolios/${portfolioId}/allocations`,
      method: "GET",
    });

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

          <h2 className="text-2xl font-extrabold">Allocations</h2>
          <div className="z-10 flex flex-col items-center justify-between">
            {allocationData && (
              <>
                <ResponsiveContainer width="100%" height={600}>
                  <PieChart>
                    <Pie
                      data={allocationData.assetAllocation}
                      dataKey="value" // Ensure dataKey maps to numerical value (e.g., 'value')
                      nameKey="name"
                      outerRadius={200} // Adjust radius as needed
                      labelLine={true} // Hide lines for cleaner look with custom labels
                      label={renderCustomizedLabel} // Pass the custom render function here
                      isAnimationActive={true} // Disable animation during development if it's distracting
                    >
                      {/* Assign colors to slices using Cell components */}
                      {allocationData.assetAllocation.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.isin}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    {/* You might also want a Tooltip and Legend */}
                    {/* <Tooltip /> */}
                    {/* <Legend /> */}
                  </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={600}>
                  <PieChart>
                    <Pie
                      data={allocationData.countryAllocation}
                      dataKey="value" // Ensure dataKey maps to numerical value (e.g., 'value')
                      nameKey="name"
                      outerRadius={200} // Adjust radius as needed
                      labelLine={true} // Hide lines for cleaner look with custom labels
                      label={renderCustomizedLabel} // Pass the custom render function here
                      isAnimationActive={true} // Disable animation during development if it's distracting
                    >
                      {/* Assign colors to slices using Cell components */}
                      {allocationData.countryAllocation.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.countryCode}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    {/* You might also want a Tooltip and Legend */}
                    {/* <Tooltip /> */}
                    {/* <Legend /> */}
                  </PieChart>
                </ResponsiveContainer>
              </>
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
 * @param {PortfolioHoldingsTableProps} props - The props for the component.
 */
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

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  index?: number;
  name?: string;
  value?: number;
}

const RADIAN = Math.PI / 180;

// Custom label rendering function
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}: CustomLabelProps) => {
  // Add checks for undefined props if they are critical for your calculation,
  // especially if 'percent' or 'name' might be missing for very small slices.
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    outerRadius === undefined ||
    percent === undefined ||
    name === undefined
  ) {
    return null; // Don't render label if crucial data is missing
  }

  // Calculate the position for the label outside the slice
  const radiusOffset = outerRadius * 1.2;
  const x = cx + radiusOffset * Math.cos(-midAngle * RADIAN);
  const y = cy + radiusOffset * Math.sin(-midAngle * RADIAN);

  // Determine text anchor based on angle to align text correctly
  const textAnchor = x > cx ? "start" : "end";

  return (
    <text
      x={x}
      y={y}
      fill="#330000" // Choose a visible color for the text
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={10} // Adjust font size as needed
    >
      {`${name} (${formatPercent(percent)})`}
    </text>
  );
};

// You'll also want to define some colors for your pie slices
// Use a consistent color palette, e.g., an array of hex codes
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF0055",
  "#66CCFF",
  "#FF6666",
  "#99FF66",
  "#FFCC00",
  "#CC66FF",
  "#FF00CC",
];
