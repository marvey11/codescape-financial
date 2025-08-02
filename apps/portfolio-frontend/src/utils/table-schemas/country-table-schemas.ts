import { formatPercent } from "@codescape-financial/core";
import { ColumnSchema } from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import { ReactNode } from "react";
import { t } from "../i18n";
import { BuildTableSchemaOptions } from "./types";

const allColumnKeys = ["name", "countryCode", "withholdingTaxRate"] as const;
type CountryTableColumnKey = (typeof allColumnKeys)[number];

const buildCountryTableSchema = (
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
      footer: (data) => t("table.footer.rows", { count: data.length }),
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
  value: (item) => item.name,
};

const countryCodeColumnSchema: ColumnSchema<CountryResponseDTO> = {
  id: "colid-country-code",
  header: "Code",
  value: (item) => item.countryCode,
};

const taxRateColumnSchema: ColumnSchema<CountryResponseDTO> = {
  id: "colid-country-withholding-tax-rate",
  header: "Withholding Tax Rate",
  value: (item) => formatPercent(item.withholdingTaxRate),
};

const columnMapping: {
  [key in CountryTableColumnKey]: ColumnSchema<CountryResponseDTO>;
} = {
  name: nameColumnSchema,
  countryCode: countryCodeColumnSchema,
  withholdingTaxRate: taxRateColumnSchema,
};

const createActionsComponent = (
  actionsComponent: ReactNode | ((item: CountryResponseDTO) => ReactNode),
) => {
  const fn =
    typeof actionsComponent === "function"
      ? actionsComponent
      : () => actionsComponent;

  const column: ColumnSchema<CountryResponseDTO> = {
    id: "colid-country-actions",
    header: undefined,
    value: fn,
    headerClassNames: "text-right",
    cellClassNames: "text-right",
  };

  return column;
};

export { buildCountryTableSchema };
export type { CountryTableColumnKey };
