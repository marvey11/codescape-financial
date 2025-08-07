import { ReactNode } from "react";

interface BuildTableSchemaOptions<T, U> {
  columnKeys?: U[] | undefined;
  actionsComponent?: (item: T) => ReactNode;
  disableFooter?: boolean;
}

export type { BuildTableSchemaOptions };
