import React, { ReactNode } from "react";
import { cn, isCompositeCellNode } from "../../utility";
import { CellValue, ColumnSchema, CompositeCellNode } from "./ColumnSchema";

export interface DataTableProps<T> {
  columns: ColumnSchema<T>[];
  data: T[];
  keyExtractor: (item: T) => React.Key;
}

export const DataTable = <T,>({
  columns,
  data,
  keyExtractor,
}: DataTableProps<T>) => {
  const hasFooter = columns.some((col) => col.footer);

  return (
    <table className="w-full table-auto text-left">
      <thead className="bg-gray-50 text-sm uppercase text-gray-700">
        <tr>
          {columns.map((col) => {
            const { className, ...rest } = col.headerCellProps ?? {};
            return (
              <th
                key={col.id}
                scope="col"
                {...rest}
                className={cn("px-6 py-3", col.headerClassNames, className)}
              >
                {col.header}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr
            key={keyExtractor(item)}
            className="border-b bg-white hover:bg-gray-100"
          >
            {columns.map((col) => {
              const { cellValue, display: cellDisplayValue } =
                processColumnContent(col.value, item);

              const { className: cellPropClassName, ...rest } =
                col.cellProps ?? {};

              const dynamicCellClassNames =
                typeof col.cellClassNames === "function"
                  ? col.cellClassNames(item, cellValue)
                  : col.cellClassNames;

              const cellTitle =
                col.cellTitle != null ? col.cellTitle(item) : undefined;

              return (
                <td
                  key={col.id}
                  title={cellTitle}
                  {...rest}
                  className={cn(
                    "px-6 py-4",
                    dynamicCellClassNames,
                    cellPropClassName,
                  )}
                >
                  {cellDisplayValue}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>

      {hasFooter && (
        <tfoot className="bg-gray-50 text-sm font-bold text-gray-700">
          <tr>
            {(() => {
              // Check if any column specifies a colSpan. If so, we render that single cell
              // to span the entire table width. This is useful for summary rows.
              const footerWithColspan = columns.find(
                (c) => c.footerCellProps?.colSpan,
              );

              if (footerWithColspan) {
                const { className: footerPropClassName, ...rest } =
                  footerWithColspan.footerCellProps ?? {};

                const { cellValue, display: cellDisplayValue } =
                  processColumnContent(footerWithColspan.footer, data);

                const dynamicFooterClassNames =
                  typeof footerWithColspan.footerClassNames === "function"
                    ? footerWithColspan.footerClassNames(data, cellValue)
                    : footerWithColspan.footerClassNames;

                return (
                  <td
                    key={footerWithColspan.id}
                    {...rest}
                    className={cn(
                      "px-6 py-3",
                      dynamicFooterClassNames,
                      footerPropClassName,
                    )}
                  >
                    {cellDisplayValue}
                  </td>
                );
              }

              // Default behavior: render a footer cell for each column.
              return columns.map((col) => {
                const { className: footerPropClassName, ...rest } =
                  col.footerCellProps ?? {};

                const { cellValue, display: cellDisplayValue } =
                  processColumnContent(col.footer, data);

                const dynamicFooterClassNames =
                  typeof col.footerClassNames === "function"
                    ? col.footerClassNames(data, cellValue)
                    : col.footerClassNames;
                return (
                  <td
                    key={col.id}
                    {...rest}
                    className={cn(
                      "px-6 py-3",
                      dynamicFooterClassNames,
                      footerPropClassName,
                    )}
                  >
                    {cellDisplayValue}
                  </td>
                );
              });
            })()}
          </tr>
        </tfoot>
      )}
    </table>
  );
};

/**
 * Helper function to process the column content.
 *
 * `U` can represent `T` or `T[]`
 */
const processColumnContent = <U extends T | T[], T>(
  contentFnOrNode: ReactNode | ((arg: U) => ReactNode | CompositeCellNode),
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
