import React from "react";
import { cn } from "../../utility";
import { CellValue, ColumnSchema } from "./ColumnSchema";

export interface DataTableProps<T> {
  columns: ColumnSchema<T, CellValue>[];
  data: T[];
  keyExtractor: (item: T) => React.Key;
}

export const DataTable = <T,>({
  columns,
  data,
  keyExtractor,
}: DataTableProps<T>) => {
  const hasFooter = columns.some((col) => col.footer);

  interface DataTableBodyCellProps {
    column: ColumnSchema<T, CellValue>;
    item: T;
  }

  const DataTableBodyCell = React.memo(
    ({ column, item }: DataTableBodyCellProps) => {
      const baseClassNames =
        "px-6 py-4 whitespace-nowrap text-sm text-gray-800";

      const { className: cellPropClassName, ...rest } = column.cellProps ?? {};

      // Get the raw value from the column's value getter
      const cellValue =
        typeof column.value === "function"
          ? column.value({ data: item })
          : null;

      // Determine the display value: use formatter if available, otherwise raw value
      const displayValue = column.valueFormatter
        ? column.valueFormatter({ data: item, value: cellValue })
        : (cellValue ?? ""); // Use empty string for null/undefined cellValue

      const customClasses =
        typeof column.cellClassNames === "function"
          ? column.cellClassNames({ data: item, value: cellValue })
          : column.cellClassNames;

      const cellTitle = column.cellTitle
        ? column.cellTitle({ data: item, value: cellValue })
        : undefined;

      const cellDisplayValue = column.cellRenderer
        ? column.cellRenderer({ data: item, value: cellValue })
        : displayValue;

      return (
        <td
          key={column.id}
          {...rest}
          className={cn(baseClassNames, customClasses, cellPropClassName)}
          title={cellTitle}
        >
          {cellDisplayValue}
        </td>
      );
    },
  );

  interface DataTableFooterCellProps {
    column: ColumnSchema<T, CellValue>;
    data: T[];
  }

  const DataTableFooterCell = React.memo(
    ({ column, data }: DataTableFooterCellProps) => {
      const baseClassNames =
        "px-6 py-3 whitespace-nowrap text-gray-600 text-sm";

      // If no footer content is specified for this column, render an empty cell
      // This helps maintain column alignment in footers where not every column has a sum/aggregate
      if (!column.footer) {
        return <td key={column.id} className={baseClassNames}></td>;
      }

      const { className: footerPropClassName, ...rest } =
        column.footerCellProps ?? {};

      const footerValue =
        typeof column.footer === "function" ? column.footer({ data }) : null;
      const footerDisplayValue =
        typeof column.footerFormatter === "function"
          ? column.footerFormatter({ data, value: footerValue })
          : footerValue;

      const customClasses =
        typeof column.footerClassNames === "function"
          ? column.footerClassNames({ data, value: footerValue })
          : column.footerClassNames;

      const footerCellTitle = column.footerTitle
        ? column.footerTitle({ data, value: footerValue })
        : undefined;

      return (
        <td
          title={footerCellTitle}
          {...rest}
          className={cn(baseClassNames, customClasses, footerPropClassName)}
        >
          {footerDisplayValue}
        </td>
      );
    },
  );

  return (
    <table className="min-w-full table-auto overflow-hidden rounded-lg bg-white text-left shadow-md">
      <thead className="divide-y divide-gray-200 bg-gray-100 text-sm text-gray-700">
        <tr>
          {columns.map((col) => {
            const { className, ...rest } = col.headerCellProps ?? {};
            return (
              <th
                key={col.id}
                scope="col"
                {...rest}
                className={cn(
                  "px-6 py-3 font-medium uppercase tracking-wider text-gray-600",
                  col.headerClassNames,
                  className,
                )}
              >
                {col.header ?? ""}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 bg-white">
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-6 py-4 text-center text-gray-500"
            >
              No data available.
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="border-b bg-white transition-colors duration-150 ease-in-out hover:bg-gray-50"
            >
              {columns.map((col) => (
                <DataTableBodyCell key={col.id} column={col} item={item} />
              ))}
            </tr>
          ))
        )}
      </tbody>

      {hasFooter && (
        <tfoot className="border-t border-gray-200 bg-gray-100 text-sm font-bold text-gray-700">
          <tr>
            {(() => {
              const footerWithColspan = columns.find(
                (c) => c.footerCellProps?.colSpan,
              );

              if (footerWithColspan) {
                return (
                  <DataTableFooterCell column={footerWithColspan} data={data} />
                );
              }

              return columns.map((col) => (
                // Render a footer cell for each column, even if it's empty
                <DataTableFooterCell key={col.id} column={col} data={data} />
              ));
            })()}
          </tr>
        </tfoot>
      )}
    </table>
  );
};
