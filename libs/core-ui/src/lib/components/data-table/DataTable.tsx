import React from "react";
import { cn } from "../../utility";
import { ColumnSchema } from "./ColumnSchema";

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
              const { className, ...rest } = col.cellProps ?? {};
              return (
                <td
                  key={col.id}
                  {...rest}
                  className={cn("px-6 py-4", col.cellClassNames, className)}
                >
                  {col.value(item)}
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
                const { className, ...rest } =
                  footerWithColspan.footerCellProps ?? {};

                return (
                  <td
                    key={footerWithColspan.id}
                    {...rest}
                    className={cn(
                      "px-6 py-3",
                      footerWithColspan.footerClassNames,
                      className,
                    )}
                  >
                    {typeof footerWithColspan.footer === "function"
                      ? footerWithColspan.footer(data)
                      : footerWithColspan.footer}
                  </td>
                );
              }

              // Default behavior: render a footer cell for each column.
              return columns.map((col) => {
                const { className, ...rest } = col.footerCellProps ?? {};
                return (
                  <td
                    key={col.id}
                    {...rest}
                    className={cn("px-6 py-3", col.footerClassNames, className)}
                  >
                    {typeof col.footer === "function"
                      ? col.footer(data)
                      : col.footer}
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
