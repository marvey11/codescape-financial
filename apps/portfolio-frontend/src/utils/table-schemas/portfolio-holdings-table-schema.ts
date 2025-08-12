import {
  formatCurrency,
  formatNormalizedDate,
  formatPercent,
} from "@codescape-financial/core";
import {
  CellRendererFunc,
  CellValue,
  cn,
  ColumnSchema,
  createNumberValueCellClassNames,
} from "@codescape-financial/core-ui";
import {
  AllLatestQuotesTransformedDTO,
  PortfolioHoldingEmbeddedDTO,
} from "@codescape-financial/portfolio-data-models";
import { BuildTableSchemaOptions } from "./types";

const currencyFormatter = (value: CellValue) =>
  typeof value === "number" ? formatCurrency(value) : "--";

const percentFormatter = (value: CellValue) =>
  typeof value === "number" ? formatPercent(value) : "--";

const defaultColumnKeys = [
  "isin",
  "name",
  "shares",
  "costBasis",
  "averagePrice",
  "latestPrice",
  "currentValue",
  "absoluteGainLoss",
  "relativeGainLoss",
  "dividends",
] as const;
type PortfolioHoldingDefaultColumnKey = (typeof defaultColumnKeys)[number];

type PortfolioHoldingEveryColumnKey =
  | PortfolioHoldingDefaultColumnKey
  | "realizedGains"
  | "dividends"
  | "totalGains";

const buildPortfolioHoldingColumnSchema = (
  options: BuildTableSchemaOptions<
    PortfolioHoldingEmbeddedDTO,
    PortfolioHoldingEveryColumnKey
  > = {},
  latestPrices: AllLatestQuotesTransformedDTO,
): ColumnSchema<PortfolioHoldingEmbeddedDTO>[] => {
  const { columnKeys = [...defaultColumnKeys], actionsComponent } = options;

  const schema = columnKeys.map((key) => getColumnMapping(latestPrices)[key]);

  if (actionsComponent) {
    schema.push(createActionsComponent(actionsComponent));
  }

  return schema;
};

const isinColumnSchema = {
  id: "colid-holding-stock-isin",
  header: "ISIN",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.stock.isin ?? null,
  cellClassNames: "font-mono text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const nameColumnSchema = {
  id: "colid-holding-stock-name",
  header: "Name",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.stock.name ?? null,
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const sharesColumnSchema = {
  id: "colid-holding-shares",
  header: "Shares",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.summary.totalShares ?? null,
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const costBasisColumnSchema = {
  id: "colid-holding-cost-basis",
  header: "Cost Basis",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.summary.totalCostBasis,
  valueFormatter: ({ value }) => currencyFormatter(value),
  cellClassNames: "text-xs",
  footer: ({ data }) => (data ? calculateTotalCostBasis(data) : null),
  footerFormatter: ({ value }) => currencyFormatter(value),
  footerClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const averagePriceColumnSchema = {
  id: "colid-holding-average-price",
  header: "Average Price",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.summary.averagePricePerShare,
  valueFormatter: ({ value }) => currencyFormatter(value),
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getLatestPriceColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  ({
    id: "colid-holding-stock-latest-price",
    header: "Latest Price",
    headerClassNames: "text-xs",
    value: ({ data }) => (data ? latestPrices?.[data.stock.isin]?.price : null),
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellTitle: ({ data }) =>
      data ? constructLastUpdated(latestPrices[data.stock.isin]) : undefined,
    cellClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getCurrentValueColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
): ColumnSchema<PortfolioHoldingEmbeddedDTO> =>
  ({
    id: "colid-holding-current-value",
    header: "Current Value",
    headerClassNames: "text-xs",
    value: ({ data }) =>
      data ? calculateCurrentHoldingValue(data, latestPrices) : null,
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellTitle: ({ data }) =>
      data ? constructLastUpdated(latestPrices[data.stock.isin]) : undefined,
    cellClassNames: "text-xs",
    footer: ({ data }) =>
      data ? calculateTotalCurrentValue(data, latestPrices) : null,
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getAbsoluteGainLossColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  ({
    id: "colid-holding-absolute-gain-loss",
    header: "G/L",
    headerClassNames: "text-xs",
    value: ({ data }) =>
      data ? calculateAbsoluteHoldingGainLoss(data, latestPrices) : null,
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    footer: ({ data }) =>
      data ? calculateTotalAbsoluteGainLoss(data, latestPrices) : null,
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getRelativeGainLossColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  ({
    id: "colid-holding-relative-gain-loss",
    header: "G/L [%]",
    headerClassNames: "text-xs",
    value: ({ data }) =>
      data ? calculateRelativeHoldingGainLoss(data, latestPrices) : null,
    valueFormatter: ({ value }) => percentFormatter(value),
    cellClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    footer: ({ data }) =>
      data
        ? calculateTotalRelativeGainLoss(
            calculateTotalCostBasis(data),
            calculateTotalAbsoluteGainLoss(data, latestPrices),
          )
        : null,
    footerFormatter: ({ value }) => percentFormatter(value),
    footerClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getRealizedGainsColumnSchema = () =>
  ({
    id: "colid-holding-realized-gains",
    header: "Realized Gains",
    headerClassNames: "text-xs",
    value: ({ data }) => data?.summary.totalRealizedGains,
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    footer: ({ data }) => (data ? calculateTotalRealizedGains(data) : null),
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getDividendsColumnSchema = () =>
  ({
    id: "colid-holding-dividends",
    header: "Dividends",
    headerClassNames: "text-xs",
    value: ({ data }) => {
      if (!data) {
        return null;
      }
      const { holdingDividends, holdingTaxesFromDividends } =
        getHoldingDividends(data);
      return holdingDividends - holdingTaxesFromDividends;
    },
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellTitle: ({ data }) => {
      if (!data) {
        return undefined;
      }
      const { holdingDividends, holdingTaxesFromDividends } =
        getHoldingDividends(data);
      if (holdingDividends === 0 && holdingTaxesFromDividends === 0) {
        return undefined;
      }
      return (
        `Nominal Dividends: ${formatCurrency(holdingDividends)}, ` +
        `Taxes: ${formatCurrency(holdingTaxesFromDividends)}`
      );
    },
    cellClassNames: "text-xs",
    footer: ({ data }) => {
      if (!data) {
        return null;
      }
      const { totalDividends, totalTaxesFromDividends } =
        calculateTotalDividends(data);
      return totalDividends - totalTaxesFromDividends;
    },
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerTitle: ({ data }) => {
      if (!data) {
        return undefined;
      }
      const { totalDividends, totalTaxesFromDividends } =
        calculateTotalDividends(data);
      return (
        `Nominal Dividends: ${formatCurrency(totalDividends)}, ` +
        `Taxes: ${formatCurrency(totalTaxesFromDividends)}`
      );
    },
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getTotalGainsColumnSchema = () =>
  ({
    id: "colid-holding-total-gains",
    header: "Total Gains",
    headerClassNames: "text-xs",
    value: ({ data }) =>
      (data?.summary.totalRealizedGains ?? 0) +
      (data?.summary.totalDividends ?? 0),
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    footer: ({ data }) => (data ? calculateTotalGains(data) : null),
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getColumnMapping = (
  latestPrices: AllLatestQuotesTransformedDTO,
): {
  [key in PortfolioHoldingEveryColumnKey]: ColumnSchema<PortfolioHoldingEmbeddedDTO>;
} => ({
  isin: isinColumnSchema,
  name: nameColumnSchema,
  shares: sharesColumnSchema,
  costBasis: costBasisColumnSchema,
  averagePrice: averagePriceColumnSchema,
  latestPrice: getLatestPriceColumnSchema(latestPrices),
  currentValue: getCurrentValueColumnSchema(latestPrices),
  absoluteGainLoss: getAbsoluteGainLossColumnSchema(latestPrices),
  relativeGainLoss: getRelativeGainLossColumnSchema(latestPrices),
  realizedGains: getRealizedGainsColumnSchema(),
  dividends: getDividendsColumnSchema(),
  totalGains: getTotalGainsColumnSchema(),
});

const createActionsComponent = (
  actionsComponent: CellRendererFunc<PortfolioHoldingEmbeddedDTO, CellValue>,
) =>
  ({
    id: "colid-holding-actions",
    header: undefined,
    headerClassNames: "text-right",
    cellRenderer: actionsComponent,
    cellClassNames: "text-right",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

// Data aggregation methods

const calculateTotalCostBasis = (data: PortfolioHoldingEmbeddedDTO[]) =>
  data.reduce(
    (total, { summary: { totalCostBasis } }) => total + (totalCostBasis ?? 0),
    0,
  );

const calculateCurrentHoldingValue = (
  holding: PortfolioHoldingEmbeddedDTO,
  latestPrices: AllLatestQuotesTransformedDTO,
) => {
  const {
    stock: { isin },
    summary: { totalShares },
  } = holding;

  if (totalShares == null || latestPrices[isin] == null) {
    return null;
  }

  return latestPrices[isin].price * totalShares;
};

const calculateTotalCurrentValue = (
  data: PortfolioHoldingEmbeddedDTO[],
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  data.reduce(
    (total, item) =>
      total + (calculateCurrentHoldingValue(item, latestPrices) ?? 0),
    0,
  );

const calculateAbsoluteHoldingGainLoss = (
  holding: PortfolioHoldingEmbeddedDTO,
  latestPrices: AllLatestQuotesTransformedDTO,
) => {
  const totalCostBasis = holding.summary.totalCostBasis;
  const currentValue = calculateCurrentHoldingValue(holding, latestPrices);

  if (totalCostBasis == null || currentValue == null) {
    return null;
  }

  return currentValue - totalCostBasis;
};

const calculateTotalAbsoluteGainLoss = (
  holdings: PortfolioHoldingEmbeddedDTO[],
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  holdings.reduce(
    (total, item) =>
      total + (calculateAbsoluteHoldingGainLoss(item, latestPrices) ?? 0),
    0,
  );

const calculateRelativeHoldingGainLoss = (
  holding: PortfolioHoldingEmbeddedDTO,
  latestPrices: AllLatestQuotesTransformedDTO,
) => {
  const totalCostBasis = holding.summary.totalCostBasis;
  const absoluteGainLoss = calculateAbsoluteHoldingGainLoss(
    holding,
    latestPrices,
  );

  if (
    totalCostBasis == null ||
    totalCostBasis === 0 ||
    absoluteGainLoss == null
  ) {
    return null;
  }

  return absoluteGainLoss / totalCostBasis;
};

const calculateTotalRelativeGainLoss = (
  totalCostBasis: number,
  totalAbsoluteGainLoss: number,
) => {
  if (totalCostBasis === 0) {
    return null;
  }

  return totalAbsoluteGainLoss / totalCostBasis;
};

const calculateTotalRealizedGains = (data: PortfolioHoldingEmbeddedDTO[]) =>
  data.reduce(
    (total, { summary: { totalRealizedGains } }) =>
      total + (totalRealizedGains ?? 0),
    0,
  );

const getHoldingDividends = ({
  summary: { totalDividends, totalTaxFromDividends },
}: PortfolioHoldingEmbeddedDTO) => ({
  holdingDividends: totalDividends ?? 0,
  holdingTaxesFromDividends: totalTaxFromDividends ?? 0,
});

const calculateTotalDividends = (data: PortfolioHoldingEmbeddedDTO[]) =>
  data.reduce(
    ({ totalDividends, totalTaxesFromDividends }, holding) => {
      const { holdingDividends, holdingTaxesFromDividends } =
        getHoldingDividends(holding);
      return {
        totalDividends: totalDividends + (holdingDividends ?? 0),
        totalTaxesFromDividends:
          totalTaxesFromDividends + (holdingTaxesFromDividends ?? 0),
      };
    },
    { totalDividends: 0, totalTaxesFromDividends: 0 },
  );

const calculateTotalGains = (data: PortfolioHoldingEmbeddedDTO[]) => {
  const { totalDividends, totalTaxesFromDividends } =
    calculateTotalDividends(data);
  return (
    calculateTotalRealizedGains(data) +
    (totalDividends - totalTaxesFromDividends)
  );
};

const constructLastUpdated = (
  obj: { date: Date; price: number } | undefined,
) =>
  obj != null
    ? `Last updated on ${formatNormalizedDate(obj.date, "en-GB")}`
    : undefined;

export { buildPortfolioHoldingColumnSchema };
export type {
  PortfolioHoldingDefaultColumnKey,
  PortfolioHoldingEveryColumnKey,
};
