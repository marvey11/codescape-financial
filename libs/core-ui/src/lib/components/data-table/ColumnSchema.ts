import { ReactNode } from "react";

export interface ColumnSchema<T> {
  header: ReactNode;
  headerClassNames?: string;
  value: (item: T) => ReactNode;
  cellClassNames?: string;
  footer?: ReactNode | ((data: T[]) => ReactNode);
  footerClassNames?: string;
}
