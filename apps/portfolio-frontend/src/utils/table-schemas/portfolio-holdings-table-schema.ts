import { formatCurrency, formatPercent } from "@codescape-financial/core";
import { ColumnSchema } from "@codescape-financial/core-ui";
import {
  AllLatestQuotesResponseDTO,
  PortfolioHoldingEmbeddedDTO,
} from "@codescape-financial/portfolio-data-models";
import { ReactNode } from "react";
import { BuildTableSchemaOptions } from "./types";

const allColumnKeys = [
  "isin",
  "name",
  "shares",
  "costBasis",
  "averagePrice",
  "latestPrice",
  "currentValue",
  "absoluteGainLoss",
  "relativeGainLoss",
] as const;
type PortfolioHoldingColumnKey = (typeof allColumnKeys)[number];

const buildPortfolioHoldingColumnSchema = (
  options: BuildTableSchemaOptions<
    PortfolioHoldingEmbeddedDTO,
    PortfolioHoldingColumnKey
  > = {},
  latestPrices: AllLatestQuotesResponseDTO,
): ColumnSchema<PortfolioHoldingEmbeddedDTO>[] => {
  const { columnKeys = [...allColumnKeys], actionsComponent } = options;

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
  value: ({ stock: { isin } }) => isin,
  cellClassNames: "font-mono text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const nameColumnSchema = {
  id: "colid-holding-stock-name",
  header: "Name",
  headerClassNames: "text-xs",
  value: ({ stock: { name } }) => name,
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const sharesColumnSchema = {
  id: "colid-holding-shares",
  header: "Shares",
  headerClassNames: "text-xs",
  value: ({ summary: { totalShares } }) => totalShares ?? "--",
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const costBasisColumnSchema = {
  id: "colid-holding-cost-basis",
  header: "Cost Basis",
  headerClassNames: "text-xs",
  value: ({ summary: { totalCostBasis } }) =>
    totalCostBasis != null ? formatCurrency(totalCostBasis) : "--",
  cellClassNames: "text-xs",
  footer: (data) => formatCurrency(calculateTotalCostBasis(data)),
  footerClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const averagePriceColumnSchema = {
  id: "colid-holding-average-price",
  header: "Average Price",
  headerClassNames: "text-xs",
  value: ({ summary: { averagePricePerShare } }) =>
    averagePricePerShare != null ? formatCurrency(averagePricePerShare) : "--",
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getLatestPriceColumnSchema = (latestPrices: AllLatestQuotesResponseDTO) =>
  ({
    id: "colid-holding-stock-latest-price",
    header: "Latest Price",
    headerClassNames: "text-xs",
    value: ({ stock: { isin } }) =>
      latestPrices[isin] != null
        ? formatCurrency(latestPrices[isin].price)
        : "--",
    cellClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getCurrentValueColumnSchema = (
  latestPrices: AllLatestQuotesResponseDTO,
): ColumnSchema<PortfolioHoldingEmbeddedDTO> =>
  ({
    id: "colid-holding-current-value",
    header: "Current Value",
    headerClassNames: "text-xs",
    value: (item) => {
      const current = calculateCurrentHoldingValue(item, latestPrices);
      return current != null ? formatCurrency(current) : "--";
    },
    cellClassNames: "text-xs",
    footer: (data) =>
      formatCurrency(calculateTotalCurrentValue(data, latestPrices)),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getAbsoluteGainLossColumnSchema = (
  latestPrices: AllLatestQuotesResponseDTO,
) =>
  ({
    id: "colid-holding-absolute-gain-loss",
    header: "G/L",
    headerClassNames: "text-xs",
    value: (item) => {
      const absoluteGainLoss = calculateAbsoluteHoldingGainLoss(
        item,
        latestPrices,
      );
      return absoluteGainLoss != null ? formatCurrency(absoluteGainLoss) : "--";
    },
    cellClassNames: "text-xs",
    footer: (data) =>
      formatCurrency(calculateTotalAbsoluteGainLoss(data, latestPrices)),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getRelativeGainLossColumnSchema = (
  latestPrices: AllLatestQuotesResponseDTO,
) =>
  ({
    id: "colid-holding-relative-gain-loss",
    header: "G/L [%]",
    headerClassNames: "text-xs",
    value: (item) => {
      const relativeGainLoss = calculateRelativeHoldingGainLoss(
        item,
        latestPrices,
      );
      return relativeGainLoss != null ? formatPercent(relativeGainLoss) : "--";
    },
    cellClassNames: "text-xs",
    footer: (data) => {
      const totalCostBasis = calculateTotalCostBasis(data);
      const totalAbsoluteGainLoss = calculateTotalAbsoluteGainLoss(
        data,
        latestPrices,
      );

      const relativeGainLoss = calculateTotalRelativeGainLoss(
        totalCostBasis,
        totalAbsoluteGainLoss,
      );

      return relativeGainLoss != null ? formatPercent(relativeGainLoss) : "--";
    },
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getColumnMapping = (
  latestPrices: AllLatestQuotesResponseDTO,
): {
  [key in PortfolioHoldingColumnKey]: ColumnSchema<PortfolioHoldingEmbeddedDTO>;
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
});

const createActionsComponent = (
  actionsComponent:
    | ReactNode
    | ((item: PortfolioHoldingEmbeddedDTO) => ReactNode),
) => {
  const fn =
    typeof actionsComponent === "function"
      ? actionsComponent
      : () => actionsComponent;

  return {
    id: "colid-holding-actions",
    header: undefined,
    value: fn,
    headerClassNames: "text-right",
    cellClassNames: "text-right",
  } satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;
};

// Data aggregation methods

const calculateTotalCostBasis = (data: PortfolioHoldingEmbeddedDTO[]) =>
  data.reduce(
    (total, { summary: { totalCostBasis } }) => total + (totalCostBasis ?? 0),
    0,
  );

const calculateCurrentHoldingValue = (
  holding: PortfolioHoldingEmbeddedDTO,
  latestPrices: AllLatestQuotesResponseDTO,
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
  latestPrices: AllLatestQuotesResponseDTO,
) =>
  data.reduce(
    (total, item) =>
      total + (calculateCurrentHoldingValue(item, latestPrices) ?? 0),
    0,
  );

const calculateAbsoluteHoldingGainLoss = (
  holding: PortfolioHoldingEmbeddedDTO,
  latestPrices: AllLatestQuotesResponseDTO,
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
  latestPrices: AllLatestQuotesResponseDTO,
) =>
  holdings.reduce(
    (total, item) =>
      total + (calculateAbsoluteHoldingGainLoss(item, latestPrices) ?? 0),
    0,
  );

const calculateRelativeHoldingGainLoss = (
  holding: PortfolioHoldingEmbeddedDTO,
  latestPrices: AllLatestQuotesResponseDTO,
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

export { buildPortfolioHoldingColumnSchema };
export type { PortfolioHoldingColumnKey };
