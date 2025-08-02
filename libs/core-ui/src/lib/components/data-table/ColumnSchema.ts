import { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export interface ColumnSchema<T> {
  id: string;
  header: ReactNode;
  headerClassNames?: string;
  /** Optional HTML attributes for the header `<th>` element. */
  headerCellProps?: ThHTMLAttributes<HTMLTableHeaderCellElement>;

  value: (item: T) => ReactNode;
  cellClassNames?: string;
  /** Optional HTML attributes for the body `<td>` element. */
  cellProps?: TdHTMLAttributes<HTMLTableDataCellElement>;

  footer?: ReactNode | ((data: T[]) => ReactNode);
  footerClassNames?: string;
  /** Optional HTML attributes for the footer `<td>` element, e.g., for `colSpan`. */
  footerCellProps?: TdHTMLAttributes<HTMLTableDataCellElement>;
}
