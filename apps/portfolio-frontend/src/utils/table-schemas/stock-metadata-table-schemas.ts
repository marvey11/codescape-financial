import { ColumnSchema } from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { ReactNode } from "react";
import { t } from "../i18n";
import { BuildTableSchemaOptions } from "./types";

const allColumnKeys = ["name", "isin", "nsin", "country", "currency"] as const;
type StockTableColumnKey = (typeof allColumnKeys)[number];

const buildStockMetadataTableSchema = (
  options: BuildTableSchemaOptions<StockResponseDTO, StockTableColumnKey> = {},
): ColumnSchema<StockResponseDTO>[] => {
  const {
    columnKeys = [...allColumnKeys],
    actionsComponent,
    disableFooter = false,
  } = options;

  const schema = columnKeys.map((key) => columnMapping[key]);

  if (actionsComponent) {
    schema.push(createActionsComponent(actionsComponent));
  }

  if (!disableFooter && schema.length) {
    // To create a single footer cell that spans all columns,
    // we define the footer on the *first* column and provide a `colSpan`
    // attribute via `footerCellProps`. The DataTable component is designed
    // to handle this case.
    const first = schema[0] as ColumnSchema<StockResponseDTO>;
    schema[0] = {
      ...first,
      footer: (data) => t("table.footer.rows", { count: data.length }),
      footerClassNames: "text-right uppercase",
      footerCellProps: {
        colSpan: schema.length,
      },
    };
  }

  return schema;
};

const nameColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-name",
  header: "Name",
  value: (item) => item.name,
};

const isinColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-isin",
  header: "ISIN",
  value: (item) => item.isin,
  cellClassNames: "font-mono",
};

const nsinColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-nsin",
  header: "NSIN",
  value: (item) => item.nsin,
  cellClassNames: "font-mono",
};

const countryColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-country",
  header: "Country",
  value: (item) => item.country.name,
};

const currencyColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-currency",
  header: "Currency",
  value: (item) => item.currency,
  cellClassNames: "font-mono",
};

const columnMapping: {
  [key in StockTableColumnKey]: ColumnSchema<StockResponseDTO>;
} = {
  name: nameColumnSchema,
  isin: isinColumnSchema,
  nsin: nsinColumnSchema,
  country: countryColumnSchema,
  currency: currencyColumnSchema,
};

const createActionsComponent = (
  actionsComponent: ReactNode | ((item: StockResponseDTO) => ReactNode),
) => {
  const fn =
    typeof actionsComponent === "function"
      ? actionsComponent
      : () => actionsComponent;

  const column: ColumnSchema<StockResponseDTO> = {
    id: "colid-stock-actions",
    header: undefined,
    value: fn,
    headerClassNames: "text-right",
    cellClassNames: "text-right",
  };

  return column;
};

export { buildStockMetadataTableSchema };
export type { StockTableColumnKey };
