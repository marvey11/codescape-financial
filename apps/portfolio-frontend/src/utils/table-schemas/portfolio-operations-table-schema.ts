import {
  CellRendererFunc,
  CellValue,
  ColumnSchema,
} from "@codescape-financial/core-ui";
import { PortfolioOperationEmbeddedDTO } from "@codescape-financial/portfolio-data-models";
import { t } from "../i18n";
import { BuildTableSchemaOptions } from "./types";

const allColumnKeys = ["type"] as const;
export type OperationsTableColumnKey = (typeof allColumnKeys)[number];

export const buildPortfolioOperationsColumnSchema = (
  typeRenderer: CellRendererFunc<PortfolioOperationEmbeddedDTO, CellValue>,
  options: BuildTableSchemaOptions<
    PortfolioOperationEmbeddedDTO,
    OperationsTableColumnKey
  > = {},
): ColumnSchema<PortfolioOperationEmbeddedDTO>[] => {
  const {
    columnKeys = [...allColumnKeys],
    actionsComponent,
    disableFooter = false,
  } = options;

  const schema = columnKeys.map((key) => getColumnMapping(typeRenderer)[key]);

  if (actionsComponent) {
    schema.push(createActionsComponent(actionsComponent));
  }

  if (!disableFooter && schema.length) {
    // To create a single footer cell that spans all columns,
    // we define the footer on the *first* column and provide a `colSpan`
    // attribute via `footerCellProps`. The DataTable component is designed
    // to handle this case.
    const first = schema[0] as ColumnSchema<PortfolioOperationEmbeddedDTO>;
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

const getTypeColumnSchema = (
  typeRenderer: CellRendererFunc<PortfolioOperationEmbeddedDTO, CellValue>,
): ColumnSchema<PortfolioOperationEmbeddedDTO> => ({
  id: "colid-portfolio-operation-type",
  header: "Type",
  cellRenderer: typeRenderer,
  value: ({ data }) => data?.type,
  cellClassNames: "font-mono",
});

const getColumnMapping = (
  typeRenderer: CellRendererFunc<PortfolioOperationEmbeddedDTO, CellValue>,
): {
  [key in OperationsTableColumnKey]: ColumnSchema<PortfolioOperationEmbeddedDTO>;
} => ({
  type: getTypeColumnSchema(typeRenderer),
});

const createActionsComponent = (
  actionsComponent: CellRendererFunc<PortfolioOperationEmbeddedDTO, CellValue>,
) => ({
  id: "colid-portfolio-operation-actions",
  header: undefined,
  cellRenderer: actionsComponent,
  headerClassNames: "text-right",
  cellClassNames: "text-right",
});
