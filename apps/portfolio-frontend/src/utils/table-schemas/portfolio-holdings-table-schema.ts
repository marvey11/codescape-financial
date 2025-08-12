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

/**
 * Interface for the composition of a nominal value and its accompanying tax value.
 *
 * @property context - The context of the composition, either `holding` or `total`.
 * @property nominalValue - The nominal value.
 * @property taxValue - The tax value based on the nominal value.
 */
interface CompositionType {
  context: "holding" | "total";
  nominalValue: number;
  taxValue: number;
}

/**
 * The default column keys for the portfolio holdings table.
 */
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

/**
 * The type for the default column keys for the portfolio holdings table.
 */
export type PortfolioHoldingDefaultColumns = (typeof defaultColumnKeys)[number];

/**
 * The type for every column key for the portfolio holdings table.
 */
export type PortfolioHoldingExtendedColumns =
  | PortfolioHoldingDefaultColumns
  | "realizedGains"
  | "totalGains";

/**
 * Builds the column schema for the portfolio holdings table.
 *
 * @param options - The options for building the table schema.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The column schema for the portfolio holdings table.
 */
export const buildPortfolioHoldingColumnSchema = (
  options: BuildTableSchemaOptions<
    PortfolioHoldingEmbeddedDTO,
    PortfolioHoldingExtendedColumns
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

/**
 * The column schema for the ISIN column.
 */
const isinColumnSchema = {
  id: "colid-holding-stock-isin",
  header: "ISIN",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.stock.isin,
  cellClassNames: "font-mono text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * The column schema for the name column.
 */
const nameColumnSchema = {
  id: "colid-holding-stock-name",
  header: "Name",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.stock.name,
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * The column schema for the shares column.
 */
const sharesColumnSchema = {
  id: "colid-holding-shares",
  header: "Shares",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.summary.totalShares,
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * The column schema for the cost basis column.
 */
const costBasisColumnSchema = {
  id: "colid-holding-cost-basis",
  header: "Cost Basis",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.summary.totalCostBasis,
  valueFormatter: ({ value }) => currencyFormatter(value),
  cellClassNames: "text-xs",
  footer: ({ data }) => calculateTotalCostBasis(data),
  footerFormatter: ({ value }) => currencyFormatter(value),
  footerClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * The column schema for the average price column.
 */
const averagePriceColumnSchema = {
  id: "colid-holding-average-price",
  header: "Average Price",
  headerClassNames: "text-xs",
  value: ({ data }) => data?.summary.averagePricePerShare,
  valueFormatter: ({ value }) => currencyFormatter(value),
  cellClassNames: "text-xs",
} satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * Gets the column schema for the latest price column.
 *
 * @param latestPrices - The latest prices for the holdings.
 * @returns The column schema for the latest price column.
 */
const getLatestPriceColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  ({
    id: "colid-holding-stock-latest-price",
    header: "Latest Price",
    headerClassNames: "text-xs",
    value: ({ data }) => getHoldingLatestPrice(data, latestPrices),
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellTitle: ({ data }) => constructLastUpdatedCellTitle(data, latestPrices),
    cellClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * Gets the column schema for the current value column.
 *
 * @param latestPrices - The latest prices for the holdings.
 * @returns The column schema for the current value column.
 */
const getCurrentValueColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
): ColumnSchema<PortfolioHoldingEmbeddedDTO> =>
  ({
    id: "colid-holding-current-value",
    header: "Current Value",
    headerClassNames: "text-xs",
    value: ({ data }) => calculateHoldingCurrentValue(data, latestPrices),
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellTitle: ({ data }) => constructLastUpdatedCellTitle(data, latestPrices),
    cellClassNames: "text-xs",
    footer: ({ data }) => calculateTotalCurrentValue(data, latestPrices),
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * Gets the column schema for the absolute gain/loss column.
 *
 * @param latestPrices - The latest prices for the holdings.
 * @returns The column schema for the absolute gain/loss column.
 */
const getAbsoluteGainLossColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  ({
    id: "colid-holding-absolute-gain-loss",
    header: "G/L",
    headerClassNames: "text-xs",
    value: ({ data }) => calculateHoldingAbsoluteGainLoss(data, latestPrices),
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    footer: ({ data }) => calculateTotalAbsoluteGainLoss(data, latestPrices),
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * Gets the column schema for the relative gain/loss column.
 *
 * @param latestPrices - The latest prices for the holdings.
 * @returns The column schema for the relative gain/loss column.
 */
const getRelativeGainLossColumnSchema = (
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  ({
    id: "colid-holding-relative-gain-loss",
    header: "G/L [%]",
    headerClassNames: "text-xs",
    value: ({ data }) => calculateHoldingRelativeGainLoss(data, latestPrices),
    valueFormatter: ({ value }) => percentFormatter(value),
    cellClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    footer: ({ data }) => calculateTotalRelativeGainLoss(data, latestPrices),
    footerFormatter: ({ value }) => percentFormatter(value),
    footerClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * Gets the column schema for the realized gains column.
 *
 * @returns The column schema for the realized gains column.
 */
const getRealizedGainsColumnSchema = () =>
  ({
    id: "colid-holding-realized-gains",
    header: "Realized Gains",
    headerClassNames: "text-xs",
    value: ({ data }) => calculateRealizedGains(data),
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    cellTitle: ({ data }) => constructRealizedGainsCellTitle(data),
    footer: ({ data }) => calculateRealizedGains(data),
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    footerTitle: ({ data }) => constructRealizedGainsCellTitle(data),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * Gets the column schema for the dividends column.
 *
 * @returns The column schema for the dividends column.
 */
const getDividendsColumnSchema = () =>
  ({
    id: "colid-holding-dividends",
    header: "Dividends",
    headerClassNames: "text-xs",
    value: ({ data }) => calculateDividends(data),
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellTitle: ({ data }) => constructDividendsCellTitle(data),
    cellClassNames: "text-xs",
    footer: ({ data }) => calculateDividends(data),
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerTitle: ({ data }) => constructDividendsCellTitle(data),
    footerClassNames: "text-xs",
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * Gets the column schema for the total gains column.
 *
 * @returns The column schema for the total gains column.
 */
const getTotalGainsColumnSchema = () =>
  ({
    id: "colid-holding-total-gains",
    header: "Total Gains",
    headerClassNames: "text-xs",
    value: ({ data }) => calculateHoldingCompositeGains(data),
    valueFormatter: ({ value }) => currencyFormatter(value),
    cellClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    cellTitle: ({ data }) => constructCompositeGainsCellTitle(data),
    footer: ({ data }) => calculateTotalCompositeGains(data),
    footerFormatter: ({ value }) => currencyFormatter(value),
    footerClassNames: ({ value }) =>
      cn("text-xs", createNumberValueCellClassNames(value)),
    footerTitle: ({ data }) => constructCompositeGainsCellTitle(data),
  }) satisfies ColumnSchema<PortfolioHoldingEmbeddedDTO>;

/**
 * Gets the column mapping for the portfolio holdings table.
 *
 * @param latestPrices - The latest prices for the holdings.
 * @returns The column mapping for the portfolio holdings table.
 */
const getColumnMapping = (
  latestPrices: AllLatestQuotesTransformedDTO,
): {
  [key in PortfolioHoldingExtendedColumns]: ColumnSchema<PortfolioHoldingEmbeddedDTO>;
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

/**
 * Creates the actions component for the portfolio holdings table.
 *
 * @param actionsComponent - The actions component.
 * @returns The actions component for the portfolio holdings table.
 */
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

// -------- DATA AGGREGATORS --------

/**
 * Calculates the total cost basis for a list of holdings.
 *
 * @param holding - The list of holdings.
 * @returns The total cost basis.
 */
const calculateTotalCostBasis = (
  holding: PortfolioHoldingEmbeddedDTO[] | undefined,
) =>
  holding?.reduce(
    (total, { summary: { totalCostBasis } }) => total + (totalCostBasis ?? 0),
    0,
  );

/**
 * Gets the latest price for a holding.
 *
 * @param holding - The holding.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The latest price for the holding.
 */
const getHoldingLatestPrice = (
  holding: PortfolioHoldingEmbeddedDTO | undefined,
  latestPrices: AllLatestQuotesTransformedDTO,
) => (holding ? latestPrices[holding.stock.isin]?.price : null);

/**
 * Calculates the current value of a holding.
 *
 * @param holding - The holding.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The current value of the holding.
 */
const calculateHoldingCurrentValue = (
  holding: PortfolioHoldingEmbeddedDTO | undefined,
  latestPrices: AllLatestQuotesTransformedDTO,
) => {
  if (!holding) {
    return null;
  }

  const {
    stock: { isin },
    summary: { totalShares },
  } = holding;

  const latestPrice = latestPrices[isin]?.price;

  if (totalShares == null || latestPrice == null) {
    return null;
  }

  return latestPrice * totalShares;
};

/**
 * Calculates the total current value of a list of holdings.
 *
 * @param holdings - The list of holdings.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The total current value of the list of holdings.
 */
const calculateTotalCurrentValue = (
  holdings: PortfolioHoldingEmbeddedDTO[] | undefined,
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  holdings?.reduce(
    (total, item) =>
      total + (calculateHoldingCurrentValue(item, latestPrices) ?? 0),
    0,
  );

/**
 * Calculates the absolute gain/loss for a holding.
 *
 * @param holding - The holding.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The absolute gain/loss for the holding.
 */
const calculateHoldingAbsoluteGainLoss = (
  holding: PortfolioHoldingEmbeddedDTO | undefined,
  latestPrices: AllLatestQuotesTransformedDTO,
) => {
  const totalCostBasis = holding?.summary.totalCostBasis;
  const currentValue = calculateHoldingCurrentValue(holding, latestPrices);

  if (totalCostBasis == null || currentValue == null) {
    return null;
  }

  return currentValue - totalCostBasis;
};

/**
 * Calculates the total absolute gain/loss for a list of holdings.
 *
 * @param holdings - The list of holdings.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The total absolute gain/loss for the list of holdings.
 */
const calculateTotalAbsoluteGainLoss = (
  holdings: PortfolioHoldingEmbeddedDTO[] | undefined,
  latestPrices: AllLatestQuotesTransformedDTO,
) =>
  holdings?.reduce(
    (total, item) =>
      total + (calculateHoldingAbsoluteGainLoss(item, latestPrices) ?? 0),
    0,
  );

/**
 * Calculates the relative gain/loss for a holding.
 *
 * @param holding - The holding.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The relative gain/loss for the holding.
 */
const calculateHoldingRelativeGainLoss = (
  holding: PortfolioHoldingEmbeddedDTO | undefined,
  latestPrices: AllLatestQuotesTransformedDTO,
) => {
  const costBasis = holding?.summary.totalCostBasis;
  const absoluteGainLoss = calculateHoldingAbsoluteGainLoss(
    holding,
    latestPrices,
  );

  return absoluteGainLoss != null && costBasis
    ? absoluteGainLoss / costBasis
    : null;
};

/**
 * Calculates the total relative gain/loss for a list of holdings.
 *
 * @param holdings - The list of holdings.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The total relative gain/loss for the list of holdings.
 */
const calculateTotalRelativeGainLoss = (
  holdings: PortfolioHoldingEmbeddedDTO[] | undefined,
  latestPrices: AllLatestQuotesTransformedDTO,
) => {
  const totalAbsoluteGainLoss = calculateTotalAbsoluteGainLoss(
    holdings,
    latestPrices,
  );
  const totalCostBasis = calculateTotalCostBasis(holdings);

  return totalAbsoluteGainLoss != null && totalCostBasis
    ? totalAbsoluteGainLoss / totalCostBasis
    : null;
};

/**
 * Gets the components of the realized gains for a holding or a list of holdings.
 *
 * @param oneOrMany - The holding or list of holdings.
 * @returns The components of the realized gains.
 */
const getRealizedGainsComponents = (
  oneOrMany: PortfolioHoldingEmbeddedDTO | PortfolioHoldingEmbeddedDTO[],
): CompositionType => {
  const getComponentsForHolding = (holding: PortfolioHoldingEmbeddedDTO) =>
    ({
      context: "holding",
      nominalValue: holding.summary.totalRealizedGains ?? 0,
      taxValue: holding.summary.totalTaxFromSoldShares ?? 0,
    }) satisfies CompositionType;

  if (Array.isArray(oneOrMany)) {
    return oneOrMany.reduce(
      (composite, holding) => {
        const { nominalValue, taxValue } = getComponentsForHolding(holding);
        return {
          ...composite,
          nominalValue: composite.nominalValue + nominalValue,
          taxValue: composite.taxValue + taxValue,
        };
      },
      { context: "total", nominalValue: 0, taxValue: 0 },
    );
  }

  return getComponentsForHolding(oneOrMany);
};

/**
 * Calculates the realized gains for a holding or a list of holdings.
 *
 * @param oneOrMany - The holding or list of holdings.
 * @returns The realized gains.
 */
const calculateRealizedGains = (
  oneOrMany:
    | PortfolioHoldingEmbeddedDTO
    | PortfolioHoldingEmbeddedDTO[]
    | undefined,
) => {
  if (!oneOrMany) {
    return null;
  }
  const { nominalValue: nominalGains, taxValue: taxesFromSoldShares } =
    getRealizedGainsComponents(oneOrMany);
  return nominalGains - taxesFromSoldShares;
};

/**
 * Gets the components of the dividends for a holding or a list of holdings.
 *
 * @param oneOrMany - The holding or list of holdings.
 * @returns The components of the dividends.
 */
const getDividendComponents = (
  oneOrMany: PortfolioHoldingEmbeddedDTO | PortfolioHoldingEmbeddedDTO[],
): CompositionType => {
  const getComponentsForHolding = (holding: PortfolioHoldingEmbeddedDTO) =>
    ({
      context: "holding",
      nominalValue: holding.summary.totalDividends ?? 0,
      taxValue: holding.summary.totalTaxFromDividends ?? 0,
    }) satisfies CompositionType;

  if (Array.isArray(oneOrMany)) {
    return oneOrMany.reduce(
      (composite, holding) => {
        const { nominalValue, taxValue } = getComponentsForHolding(holding);
        return {
          ...composite,
          nominalValue: composite.nominalValue + nominalValue,
          taxValue: composite.taxValue + taxValue,
        };
      },
      { context: "total", nominalValue: 0, taxValue: 0 },
    );
  }

  return getComponentsForHolding(oneOrMany);
};

/**
 * Calculates the dividends for a holding or a list of holdings.
 *
 * @param oneOrMany - The holding or list of holdings.
 * @returns The dividends.
 */
const calculateDividends = (
  oneOrMany:
    | PortfolioHoldingEmbeddedDTO
    | PortfolioHoldingEmbeddedDTO[]
    | undefined,
) => {
  if (!oneOrMany) {
    return null;
  }
  const { nominalValue, taxValue } = getDividendComponents(oneOrMany);
  return nominalValue - taxValue;
};

/**
 * Calculates the composite gains for a holding.
 *
 * @param holding - The holding.
 * @returns The composite gains for the holding.
 */
const calculateHoldingCompositeGains = (
  holding: PortfolioHoldingEmbeddedDTO | undefined,
) =>
  holding
    ? (calculateRealizedGains(holding) ?? 0) +
      (calculateDividends(holding) ?? 0)
    : null;

/**
 * Calculates the total composite gains for a list of holdings.
 *
 * @param holdings - The list of holdings.
 * @returns The total composite gains for the list of holdings.
 */
const calculateTotalCompositeGains = (
  holdings: PortfolioHoldingEmbeddedDTO[] | undefined,
) =>
  holdings?.reduce(
    (sumGains, holding) =>
      sumGains + (calculateHoldingCompositeGains(holding) ?? 0),
    0,
  );

// -------- CELL TITLE CONSTRUCTORS --------

/**
 * Constructs the cell title for the last updated date.
 *
 * @param holding - The holding.
 * @param latestPrices - The latest prices for the holdings.
 * @returns The cell title for the last updated date.
 */
const constructLastUpdatedCellTitle = (
  holding: PortfolioHoldingEmbeddedDTO | undefined,
  latestPrices: AllLatestQuotesTransformedDTO,
) => {
  const latestDate = holding ? latestPrices[holding.stock.isin]?.date : null;
  return latestDate != null
    ? `Last updated on ${formatNormalizedDate(latestDate, "en-GB")}`
    : undefined;
};

/**
 * Constructs the cell title for the realized gains.
 *
 * @param oneOrMany - The holding or list of holdings.
 * @returns The cell title for the realized gains.
 */
const constructRealizedGainsCellTitle = (
  oneOrMany:
    | PortfolioHoldingEmbeddedDTO
    | PortfolioHoldingEmbeddedDTO[]
    | undefined,
) =>
  oneOrMany
    ? formatRealizedGainsCellTitle(getRealizedGainsComponents(oneOrMany))
    : undefined;

/**
 * Constructs the cell title for the dividends.
 *
 * @param oneOrMany - The holding or list of holdings.
 * @returns The cell title for the dividends.
 */
const constructDividendsCellTitle = (
  oneOrMany:
    | PortfolioHoldingEmbeddedDTO
    | PortfolioHoldingEmbeddedDTO[]
    | undefined,
) =>
  oneOrMany
    ? formatDividendsCellTitle(getDividendComponents(oneOrMany))
    : undefined;

/**
 * Constructs the cell title for the composite gains.
 *
 * @param oneOrMany - The holding or list of holdings.
 * @returns The cell title for the composite gains.
 */
const constructCompositeGainsCellTitle = (
  oneOrMany:
    | PortfolioHoldingEmbeddedDTO
    | PortfolioHoldingEmbeddedDTO[]
    | undefined,
) =>
  oneOrMany
    ? formatCompositeGainsCellTitle(
        getRealizedGainsComponents(oneOrMany),
        getDividendComponents(oneOrMany),
      )
    : undefined;

// -------- VALUE FORMATTERS --------

/**
 * Formats a value as a currency.
 *
 * @param value - The value to format.
 * @returns The formatted value.
 */
const currencyFormatter = (value: CellValue) =>
  typeof value === "number" ? formatCurrency(value) : "--";

/**
 * Formats a value as a percentage.
 *
 * @param value - The value to format.
 * @returns The formatted value.
 */
const percentFormatter = (value: CellValue) =>
  typeof value === "number" ? formatPercent(value) : "--";

/**
 * Formats the cell title for the realized gains.
 *
 * @param nominalValue - The nominal gains.
 * @param taxValue - The taxes from sold shares.
 * @returns The formatted cell title.
 */
const formatRealizedGainsCellTitle = ({
  nominalValue,
  taxValue,
}: CompositionType) =>
  `Nominal Realised Gains: ${formatCurrency(nominalValue)}, ` +
  `Taxes from Sold Shares: ${formatCurrency(taxValue)}`;

/**
 * Formats the cell title for the dividends.
 *
 * @param nominalValue - The nominal dividends.
 * @param taxValue - The taxes from dividends.
 * @returns The formatted cell title.
 */
const formatDividendsCellTitle = ({
  nominalValue,
  taxValue,
}: CompositionType) =>
  nominalValue > 0
    ? `Nominal Dividends: ${formatCurrency(nominalValue)}, ` +
      `Taxes from Dividends: ${formatCurrency(taxValue)}`
    : undefined;

/**
 * Formats the cell title for the composite gains.
 *
 * @param gains - The composite object for gains.
 * @param dividends - The composite object for dividends.
 * @returns The formatted cell title.
 */
const formatCompositeGainsCellTitle = (
  gains: CompositionType,
  dividends: CompositionType,
) =>
  `Composite Gains: ${formatCurrency(gains.nominalValue + dividends.nominalValue)}, ` +
  `Composite Taxes: ${formatCurrency(gains.taxValue + dividends.taxValue)}`;
