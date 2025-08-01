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
          {columns.map((col, index) => (
            <th
              key={index}
              scope="col"
              className={cn("px-6 py-3", col.headerClassNames)}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr
            key={keyExtractor(item)}
            className="border-b bg-white hover:bg-gray-100"
          >
            {columns.map((col, index) => (
              <td key={index} className={cn("px-6 py-4", col.cellClassNames)}>
                {col.value(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

      {hasFooter && (
        <tfoot className="bg-gray-50 text-sm font-bold text-gray-700">
          <tr>
            {columns.map((col, index) => (
              <td key={index} className={cn("px-6 py-3", col.footerClassNames)}>
                {typeof col.footer === "function"
                  ? col.footer(data)
                  : col.footer}
              </td>
            ))}
          </tr>
        </tfoot>
      )}
    </table>
  );
};
