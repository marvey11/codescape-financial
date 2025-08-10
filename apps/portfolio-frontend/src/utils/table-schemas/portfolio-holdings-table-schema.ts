import {
  formatCurrency,
  formatNormalizedDate,
  formatPercent,
} from "@codescape-financial/core";
import {
  cn,
  ColumnSchema,
  createNumberValueCellClassNames,
} from "@codescape-financial/core-ui";
import {
  AllLatestQuotesTransformedDTO,
  PortfolioHoldingEmbeddedDTO,
} from "@codescape-financial/portfolio-data-models";
import { ReactNode } from "react";
import { BuildTableSchemaOptions } from "./types";

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
  | "taxesFromSales"
  | "dividends"
  | "taxesFromDividends"
  | "totalGains"
  | "totalTaxes";

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

const getLatestPriceColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  ({
    id: "colid-holding-stock-latest-price",
    header: "Latest Price",
    headerClassNames: "text-xs",
    value: ({ stock: { isin } }) =>
      latestPrices[isin] != null
        ? formatCurrency(latestPrices[isin].price)
        : "--",
    cellTitle: ({ stock: { isin } }) =>
      constructLastUpdated(latestPrices[isin]),
    cellClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getCurrentValueColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
): ColumnSchema<PortfolioHoldingEmbeddedDTO> =>
  ({
    id: "colid-holding-current-value",
    header: "Current Value",
    headerClassNames: "text-xs",
    value: (item) => {
      const current = calculateCurrentHoldingValue(item, latestPrices);
      return current != null ? formatCurrency(current) : "--";
    },
    cellTitle: ({ stock: { isin } }) =>
      constructLastUpdated(latestPrices[isin]),
    cellClassNames: "text-xs",
    footer: (data) =>
      formatCurrency(calculateTotalCurrentValue(data, latestPrices)),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getAbsoluteGainLossColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
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
      return {
        cellValue: absoluteGainLoss,
        display:
          absoluteGainLoss != null ? formatCurrency(absoluteGainLoss) : "--",
      };
    },
    cellClassNames: (_, cell) =>
      cn("text-xs", createNumberValueCellClassNames(cell)),
    footer: (data) => {
      const totalAbsoluteGainLoss = calculateTotalAbsoluteGainLoss(
        data,
        latestPrices,
      );
      return {
        cellValue: totalAbsoluteGainLoss,
        display: formatCurrency(totalAbsoluteGainLoss),
      };
    },
    footerClassNames: (_, cell) =>
      cn("text-xs", createNumberValueCellClassNames(cell)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getRelativeGainLossColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
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
      return {
        cellValue: relativeGainLoss,
        display:
          relativeGainLoss != null ? formatPercent(relativeGainLoss) : "--",
      };
    },
    cellClassNames: (_, cell) =>
      cn("text-xs", createNumberValueCellClassNames(cell)),
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

      return {
        cellValue: relativeGainLoss,
        display:
          relativeGainLoss != null ? formatPercent(relativeGainLoss) : "--",
      };
    },
    footerClassNames: (_, cell) =>
      cn("text-xs", createNumberValueCellClassNames(cell)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getRealizedGainsColumnSchema = () =>
  ({
    id: "colid-holding-realized-gains",
    header: "Realized Gains",
    headerClassNames: "text-xs",
    value: (item) => {
      const realizedGains = item.summary.totalRealizedGains;
      return {
        cellValue: realizedGains,
        display: realizedGains != null ? formatCurrency(realizedGains) : "--",
      };
    },
    cellClassNames: (_, cell) =>
      cn("text-xs", createNumberValueCellClassNames(cell)),
    footer: (data) => {
      const totalRealizedGains = calculateTotalRealizedGains(data);
      return {
        cellValue: totalRealizedGains,
        display: formatCurrency(totalRealizedGains),
      };
    },
    footerClassNames: (_, cell) =>
      cn("text-xs", createNumberValueCellClassNames(cell)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getTaxesFromSalesColumnSchema = () =>
  ({
    id: "colid-holding-taxes-from-sales",
    header: "Taxes From Sales",
    headerClassNames: "text-xs",
    value: (item) => {
      const taxesFromSales = item.summary.totalTaxFromSoldShares;
      return {
        cellValue: taxesFromSales,
        display: taxesFromSales != null ? formatCurrency(taxesFromSales) : "--",
      };
    },
    cellClassNames: "text-xs",
    footer: (data) => formatCurrency(calculateTotalTaxesFromSales(data)),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getDividendsColumnSchema = () =>
  ({
    id: "colid-holding-dividends",
    header: "Dividends",
    headerClassNames: "text-xs",
    value: (item) => {
      const dividends = item.summary.totalDividends;
      return {
        cellValue: dividends,
        display: dividends != null ? formatCurrency(dividends) : "--",
      };
    },
    cellClassNames: "text-xs",
    footer: (data) => formatCurrency(calculateTotalDividends(data)),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getTaxesFromDividendsColumnSchema = () =>
  ({
    id: "colid-holding-taxes-from-dividends",
    header: "Taxes From Dividends",
    headerClassNames: "text-xs",
    value: (item) => {
      const taxesFromDividends = calculateHoldingTaxesFromDividends(item);
      return {
        cellValue: taxesFromDividends,
        display:
          taxesFromDividends != null
            ? formatCurrency(taxesFromDividends)
            : "--",
      };
    },
    cellClassNames: "text-xs",
    footer: (data) => formatCurrency(calculateTotalTaxesFromDividends(data)),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getTotalGainsColumnSchema = () =>
  ({
    id: "colid-holding-total-gains",
    header: "Total Gains",
    headerClassNames: "text-xs",
    value: (item) => {
      const gains =
        (item.summary.totalRealizedGains ?? 0) +
        (item.summary.totalDividends ?? 0);
      return {
        cellValue: gains,
        display: gains != null ? formatCurrency(gains) : "--",
      };
    },
    cellClassNames: (_, cell) =>
      cn("text-xs", createNumberValueCellClassNames(cell)),
    footer: (data) => {
      const totalGains = calculateTotalGains(data);
      return {
        cellValue: totalGains,
        display: formatCurrency(totalGains),
      };
    },
    footerClassNames: (_, cell) =>
      cn("text-xs", createNumberValueCellClassNames(cell)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

const getTotalTaxesColumnSchema = () =>
  ({
    id: "colid-holding-total-taxes",
    header: "Total Taxes",
    headerClassNames: "text-xs",
    value: (item) => {
      const taxes =
        (item.summary.totalTaxFromSoldShares ?? 0) +
        (item.summary.totalTaxFromDividends ?? 0);
      return {
        cellValue: taxes,
        display: taxes != null ? formatCurrency(taxes) : "--",
      };
    },
    cellClassNames: "text-xs",
    footer: (data) => formatCurrency(calculateTotalTaxes(data)),
    footerClassNames: "text-xs",
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
  taxesFromSales: getTaxesFromSalesColumnSchema(),
  dividends: getDividendsColumnSchema(),
  taxesFromDividends: getTaxesFromDividendsColumnSchema(),
  totalGains: getTotalGainsColumnSchema(),
  totalTaxes: getTotalTaxesColumnSchema(),
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

const calculateTotalTaxesFromSales = (data: PortfolioHoldingEmbeddedDTO[]) =>
  data.reduce(
    (total, { summary: { totalTaxFromSoldShares } }) =>
      total + (totalTaxFromSoldShares ?? 0),
    0,
  );

const calculateTotalDividends = (data: PortfolioHoldingEmbeddedDTO[]) =>
  data.reduce(
    (total, { summary: { totalDividends } }) => total + (totalDividends ?? 0),
    0,
  );

const calculateHoldingTaxesFromDividends = ({
  summary: { totalTaxFromDividends },
}: PortfolioHoldingEmbeddedDTO) => totalTaxFromDividends ?? 0;

const calculateTotalTaxesFromDividends = (
  data: PortfolioHoldingEmbeddedDTO[],
) =>
  data.reduce(
    (total, item) => total + calculateHoldingTaxesFromDividends(item),
    0,
  );

const calculateTotalGains = (data: PortfolioHoldingEmbeddedDTO[]) =>
  calculateTotalRealizedGains(data) + calculateTotalDividends(data);

const calculateTotalTaxes = (data: PortfolioHoldingEmbeddedDTO[]) =>
  calculateTotalTaxesFromSales(data) + calculateTotalTaxesFromDividends(data);

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
