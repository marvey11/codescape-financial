import { ReactNode } from "react";

interface BuildTableSchemaOptions<T, U> {
  columnKeys?: U[] | undefined;
  actionsComponent?: ReactNode | ((item: T) => ReactNode);
  disableFooter?: boolean;
}

export type { BuildTableSchemaOptions };
