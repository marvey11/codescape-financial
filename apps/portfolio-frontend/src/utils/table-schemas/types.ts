import { CellRendererFunc, CellValue } from "@codescape-financial/core-ui";

interface BuildTableSchemaOptions<TData, U> {
  columnKeys?: U[] | undefined;
  actionsComponent?: CellRendererFunc<TData, CellValue>;
  disableFooter?: boolean;
}

export type { BuildTableSchemaOptions };
