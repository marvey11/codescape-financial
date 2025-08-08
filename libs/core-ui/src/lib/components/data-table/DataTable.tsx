import React from "react";
import { cn } from "../../utility";
import { ColumnSchema } from "./ColumnSchema";
import { processColumnContent } from "./data-table-utils";

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
    <table className="w-full table-auto overflow-hidden rounded-md text-left shadow-md">
      <thead className="bg-gray-100 text-sm uppercase text-gray-700">
        <tr>
          {columns.map((col) => {
            const { className, ...rest } = col.headerCellProps ?? {};
            return (
              <th
                key={col.id}
                scope="col"
                {...rest}
                className={cn(
                  "px-6 py-3 font-semibold",
                  col.headerClassNames,
                  className,
                )}
              >
                {col.header}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
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

interface DataTableBodyCellProps<T> {
  column: ColumnSchema<T>;
  item: T;
}

const DataTableBodyCell = React.memo(
  <T,>({ column, item }: DataTableBodyCellProps<T>) => {
    const baseClassName = "px-6 py-4";

    // Only process if column.value is defined, though ColumnSchema makes it required
    if (!column.value) {
      console.warn(
        `Column with ID ${column.id} has no 'value' function defined.`,
      );
      return <td className={baseClassName}></td>;
    }

    const { cellValue, display: cellDisplayValue } = processColumnContent(
      column.value,
      item,
    );

    const { className: cellPropClassName, ...rest } = column.cellProps ?? {};

    const dynamicCellClassNames =
      typeof column.cellClassNames === "function"
        ? column.cellClassNames(item, cellValue)
        : column.cellClassNames;

    const cellTitle =
      column.cellTitle != null && typeof column.cellTitle === "function"
        ? column.cellTitle(item)
        : undefined;

    return (
      <td
        key={column.id}
        title={cellTitle}
        {...rest}
        className={cn(baseClassName, dynamicCellClassNames, cellPropClassName)}
      >
        {cellDisplayValue}
      </td>
    );
  },
) as <T>(props: DataTableBodyCellProps<T>) => React.JSX.Element;

interface DataTableFooterCellProps<T> {
  column: ColumnSchema<T>;
  data: T[];
}

const DataTableFooterCell = React.memo(
  <T,>({ column, data }: DataTableFooterCellProps<T>) => {
    const baseClassNames = "px-6 py-3";

    // If no footer content is specified for this column, render an empty cell
    // This helps maintain column alignment in footers where not every column has a sum/aggregate
    if (!column.footer) {
      return <td key={column.id} className={baseClassNames}></td>;
    }

    const { cellValue, display: cellDisplayValue } = processColumnContent(
      column.footer,
      data,
    );

    const { className: footerPropClassName, ...rest } =
      column.footerCellProps ?? {};

    const dynamicFooterClassNames =
      typeof column.footerClassNames === "function"
        ? column.footerClassNames(data, cellValue)
        : column.footerClassNames;

    const footerCellTitle =
      column.footerCellTitle != null &&
      typeof column.footerCellTitle === "function"
        ? column.footerCellTitle(data)
        : undefined;

    return (
      <td
        title={footerCellTitle}
        {...rest}
        className={cn(
          baseClassNames,
          dynamicFooterClassNames,
          footerPropClassName,
        )}
      >
        {cellDisplayValue}
      </td>
    ) as React.JSX.Element;
  },
) as <T>(props: DataTableFooterCellProps<T>) => React.JSX.Element;
