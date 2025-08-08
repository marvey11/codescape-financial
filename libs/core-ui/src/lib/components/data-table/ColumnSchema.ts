import { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export type CellValue = number | string | undefined | null;

export interface CompositeCellNode {
  cellValue?: CellValue;
  display: ReactNode;
}

export interface ColumnSchema<T> {
  id: string;

  header: ReactNode;
  headerClassNames?: string | ((item: T) => string);
  /** Optional HTML attributes for the header `<th>` element. */
  headerCellProps?: ThHTMLAttributes<HTMLTableHeaderCellElement>;

  value: ReactNode | ((item: T) => CompositeCellNode | ReactNode);
  cellTitle?: (item: T) => string | undefined;
  cellClassNames?: string | ((item: T, cellValue: CellValue) => string);
  /** Optional HTML attributes for the body `<td>` element. */
  cellProps?: TdHTMLAttributes<HTMLTableDataCellElement>;

  footer?: ReactNode | ((data: T[]) => CompositeCellNode | ReactNode);
  footerCellTitle?: (data: T[]) => string | undefined;
  footerClassNames?: string | ((data: T[], cellValue: CellValue) => string);
  /** Optional HTML attributes for the footer `<td>` element, e.g., for `colSpan`. */
  footerCellProps?: TdHTMLAttributes<HTMLTableDataCellElement>;
}
