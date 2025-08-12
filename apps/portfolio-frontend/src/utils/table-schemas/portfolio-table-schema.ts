import {
  CellRendererFunc,
  CellValue,
  ColumnSchema,
} from "@codescape-financial/core-ui";
import { PortfolioResponseDTO } from "@codescape-financial/portfolio-data-models";
import { t } from "../i18n";
import { BuildTableSchemaOptions } from "./types";

const allColumnKeys = ["name", "description"] as const;
type PortfolioTableColumnKey = (typeof allColumnKeys)[number];

const buildPortfolioColumnSchema = (
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

const nameColumnSchema: ColumnSchema<PortfolioResponseDTO> = {
  id: "colid-portfolio-name",
  header: "Name",
  value: ({ data }) => data?.name ?? "",
};

const descriptionColumnSchema: ColumnSchema<PortfolioResponseDTO> = {
  id: "colid-portfolio-description",
  header: "Description",
  value: ({ data }) => data?.description ?? "",
};

const columnMapping: {
  [key in PortfolioTableColumnKey]: ColumnSchema<PortfolioResponseDTO>;
} = {
  name: nameColumnSchema,
  description: descriptionColumnSchema,
};

const createActionsComponent = (
  actionsComponent: CellRendererFunc<PortfolioResponseDTO, CellValue>,
) => ({
  id: "colid-portfolio-actions",
  header: undefined,
  cellRenderer: actionsComponent,
  headerClassNames: "text-right",
  cellClassNames: "text-right",
});

export { buildPortfolioColumnSchema };
export type { PortfolioTableColumnKey };
