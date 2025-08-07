import { ColumnSchema } from "@codescape-financial/core-ui";
import { PortfolioResponseDTO } from "@codescape-financial/portfolio-data-models";
import { ReactNode } from "react";
import { t } from "../i18n";
import { BuildTableSchemaOptions } from "./types";

const allColumnKeys = ["name", "description"] as const;
type PortfolioTableColumnKey = (typeof allColumnKeys)[number];

const buildPortfolioTableSchema = (
  options: BuildTableSchemaOptions<
    PortfolioResponseDTO,
    PortfolioTableColumnKey
  > = {},
): ColumnSchema<PortfolioResponseDTO>[] => {
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
    const first = schema[0] as ColumnSchema<PortfolioResponseDTO>;
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

const nameColumnSchema: ColumnSchema<PortfolioResponseDTO> = {
  id: "colid-portfolio-name",
  header: "Name",
  value: (item) => item.name,
};

const descriptionColumnSchema: ColumnSchema<PortfolioResponseDTO> = {
  id: "colid-portfolio-description",
  header: "Description",
  value: (item) => item.description ?? "",
};

const columnMapping: {
  [key in PortfolioTableColumnKey]: ColumnSchema<PortfolioResponseDTO>;
} = {
  name: nameColumnSchema,
  description: descriptionColumnSchema,
};

const createActionsComponent = (
  actionsComponent: ReactNode | ((item: PortfolioResponseDTO) => ReactNode),
) => {
  const fn =
    typeof actionsComponent === "function"
      ? actionsComponent
      : () => actionsComponent;

  const column: ColumnSchema<PortfolioResponseDTO> = {
    id: "colid-portfolio-actions",
    header: undefined,
    value: fn,
    headerClassNames: "text-right",
    cellClassNames: "text-right",
  };

  return column;
};

export { buildPortfolioTableSchema };
export type { PortfolioTableColumnKey };
