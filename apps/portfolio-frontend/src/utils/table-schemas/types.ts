import { CellRendererFunc, CellValue } from "@codescape-financial/core-ui";

export interface BuildTableSchemaOptions<TData, U> {
  columnKeys?: U[] | undefined;
  actionsComponent?: CellRendererFunc<TData, CellValue>;
  disableFooter?: boolean;
}
