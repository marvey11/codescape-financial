import { formatPercent } from "@codescape-financial/core";
import {
  CellRendererFunc,
  CellValue,
  ColumnSchema,
} from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { t } from "../i18n";
import { BuildTableSchemaOptions } from "./types";

const allColumnKeys = ["name", "countryCode", "withholdingTaxRate"] as const;
export type CountryTableColumnKey = (typeof allColumnKeys)[number];

export const buildCountryColumnSchema = (
  options: BuildTableSchemaOptions<
    CountryResponseDTO,
    CountryTableColumnKey
  > = {},
): ColumnSchema<CountryResponseDTO>[] => {
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
    const first = schema[0] as ColumnSchema<CountryResponseDTO>;
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

const nameColumnSchema: ColumnSchema<CountryResponseDTO> = {
  id: "colid-country-name",
  header: "Name",
  value: ({ data }) => data?.name ?? "",
};
const countryCodeColumnSchema: ColumnSchema<CountryResponseDTO> = {
  id: "colid-country-code",
  header: "Code",
  value: ({ data }) => data?.countryCode ?? "",
};

const taxRateColumnSchema: ColumnSchema<CountryResponseDTO> = {
  id: "colid-country-withholding-tax-rate",
  header: "Withholding Tax Rate",
  value: ({ data }) => data?.withholdingTaxRate ?? 0,
  valueFormatter: ({ value }) => {
    return typeof value === "number" ? formatPercent(value) : "";
  },
};

const columnMapping: {
  [key in CountryTableColumnKey]: ColumnSchema<CountryResponseDTO>;
} = {
  name: nameColumnSchema,
  countryCode: countryCodeColumnSchema,
  withholdingTaxRate: taxRateColumnSchema,
};

const createActionsComponent = (
  actionsComponent: CellRendererFunc<CountryResponseDTO, CellValue>,
) => ({
  id: "colid-country-actions",
  header: undefined,
  headerClassNames: "text-right",
  cellRenderer: actionsComponent,
  cellClassNames: "text-right",
});
