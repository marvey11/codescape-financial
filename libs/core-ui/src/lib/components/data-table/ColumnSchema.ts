import { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export type CellValue = number | string | undefined | null;

export interface ValueGetterFunc<TData, TValue> {
  (params: { data: TData | undefined }): TValue | null | undefined;
}

export interface ValueFormatterFunc<TData, TValue> {
  (params: {
    data: TData | undefined;
    value: TValue | null | undefined;
  }): string;
}

export interface CellClassNamesFunc<TData, TValue> {
  (params: {
    data: TData | undefined;
    value: TValue | null | undefined;
  }): string | string[] | undefined;
}

export interface CellTitleFunc<TData, TValue> {
  (params: {
    data: TData | undefined;
    value: TValue | null | undefined;
  }): string | undefined;
}

export interface CellRendererFunc<TData, TValue> {
  (params: {
    data: TData | undefined;
    value: TValue | null | undefined;
  }): ReactNode;
}

export interface FooterGetterFunc<TData, TValue> {
  (params: { data: TData[] | undefined }): TValue | null | undefined;
}

export interface FooterFormatterFunc<TData, TValue> {
  (params: {
    data: TData[] | undefined;
    value: TValue | null | undefined;
  }): string;
}

export interface FooterClassNamesFunc<TData, TValue> {
  (params: {
    data: TData[] | undefined;
    value: TValue | null | undefined;
  }): string | string[] | undefined;
}

export interface FooterTitleFunc<TData, TValue> {
  (params: {
    data: TData[] | undefined;
    value: TValue | null | undefined;
  }): string | undefined;
}

export interface ColumnSchema<T, ValueType extends CellValue = CellValue> {
  id: string;

  // HEADER options

  header?: string | undefined;
  headerClassNames?: string | string[] | undefined;

  /** Optional HTML attributes for the header `<th>` element. */
  headerCellProps?: ThHTMLAttributes<HTMLTableHeaderCellElement>;

  // BODY options

  value?: ValueGetterFunc<T, ValueType>;
  valueFormatter?: ValueFormatterFunc<T, ValueType>;
  cellClassNames?: CellClassNamesFunc<T, ValueType> | string | string[];
  cellTitle?: CellTitleFunc<T, ValueType>;
  cellRenderer?: CellRendererFunc<T, ValueType>;

  /** Optional HTML attributes for the body `<td>` element. */
  cellProps?: TdHTMLAttributes<HTMLTableDataCellElement>;

  // FOOTER options

  footer?: FooterGetterFunc<T, ValueType>;
  footerFormatter?: FooterFormatterFunc<T, ValueType>;
  footerClassNames?: FooterClassNamesFunc<T, ValueType> | string | string[];
  footerTitle?: FooterTitleFunc<T, ValueType>;

  /** Optional HTML attributes for the footer `<td>` element, e.g., for `colSpan`. */
  footerCellProps?: TdHTMLAttributes<HTMLTableDataCellElement>;
}
