import { ReactNode } from "react";
import { isCompositeCellNode } from "../../utility";
import { CellValue, CompositeCellNode } from "./ColumnSchema";

/**
 * Helper function to process the column content.
 *
 * `U` can represent `T` or `T[]`
 */
export const processColumnContent = <T, U extends T | T[]>(
  contentFnOrNode:
    | ReactNode
    | ((arg: U) => ReactNode | CompositeCellNode)
    | undefined,
  argForContentFn: U,
): CompositeCellNode => {
  let cellValue: CellValue = undefined;
  let display: ReactNode;

  if (typeof contentFnOrNode === "function") {
    const result = contentFnOrNode(argForContentFn);
    if (isCompositeCellNode(result)) {
      // (arg: U) => CompositeCellNode
      cellValue = result.cellValue;
      display = result.display;
    } else {
      // (arg: U) => ReactNode
      display = result;
    }
  } else {
    // ReactNode
    display = contentFnOrNode;
  }

  return { cellValue, display } satisfies CompositeCellNode;
};
