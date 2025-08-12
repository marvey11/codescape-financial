import {
  CellRendererFunc,
  CellValue,
  ColumnSchema,
} from "@codescape-financial/core-ui";
import { StockResponseDTO } from "@codescape-financial/portfolio-data-models";
import { t } from "../i18n";
import { BuildTableSchemaOptions } from "./types";

const allColumnKeys = ["name", "isin", "nsin", "country", "currency"] as const;
export type StockTableColumnKey = (typeof allColumnKeys)[number];

export const buildStockMetadataColumnSchema = (
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
      footer: ({ data }) =>
        data ? t("table.footer.rows", { count: data.length }) : undefined,
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
  value: ({ data }) => data?.name,
};

const isinColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-isin",
  header: "ISIN",
  value: ({ data }) => data?.isin,
  cellClassNames: "font-mono",
};

const nsinColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-nsin",
  header: "NSIN",
  value: ({ data }) => data?.nsin,
  cellClassNames: "font-mono",
};

const countryColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-country",
  header: "Country",
  value: ({ data }) => data?.country.name,
};

const currencyColumnSchema: ColumnSchema<StockResponseDTO> = {
  id: "colid-stock-currency",
  header: "Currency",
  value: ({ data }) => data?.currency,
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
  actionsComponent: CellRendererFunc<StockResponseDTO, CellValue>,
) => ({
  id: "colid-stock-actions",
  header: undefined,
  cellRenderer: actionsComponent,
  headerClassNames: "text-right",
  cellClassNames: "text-right",
});
