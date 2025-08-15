import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CellValue, ColumnSchema } from "./ColumnSchema";
import { DataTable } from "./DataTable";

interface TestData {
  id: number;
  name: string;
  value: number;
}

const testData: TestData[] = [
  { id: 1, name: "Item 1", value: 100 },
  { id: 2, name: "Item 2", value: 200 },
];

const columns: ColumnSchema<TestData, CellValue>[] = [
  {
    id: "name",
    header: "Name",
    value: ({ data }) => data?.name,
  },
  {
    id: "value",
    header: "Value",
    value: ({ data }) => data?.value,
  },
];

describe("DataTable", () => {
  it("should render the table with data", () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        keyExtractor={(item) => item.id}
      />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it('should render "No data available" when data is empty', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(item) => item.id}
      />,
    );

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("should render the footer", () => {
    const columnsWithFooter: ColumnSchema<TestData, CellValue>[] = [
      ...columns,
      {
        id: "total",
        header: "Total",
        value: ({ data }) => data?.value,
        footer: ({ data }) => data?.reduce((acc, item) => acc + item.value, 0),
      },
    ];

    render(
      <DataTable
        columns={columnsWithFooter}
        data={testData}
        keyExtractor={(item) => item.id}
      />,
    );

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
  });

  it("should use valueFormatter and cellRenderer", () => {
    const columnsWithFormatter: ColumnSchema<TestData, CellValue>[] = [
      {
        id: "name",
        header: "Name",
        value: ({ data }) => data?.name,
        cellRenderer: ({ value }) => <strong>{value}</strong>,
      },
      {
        id: "value",
        header: "Value",
        value: ({ data }) => data?.value,
        valueFormatter: ({ value }) => `$${value}`,
      },
    ];

    render(
      <DataTable
        columns={columnsWithFormatter}
        data={testData}
        keyExtractor={(item) => item.id}
      />,
    );

    expect(screen.getByText("Item 1").tagName).toBe("STRONG");
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  it("should handle colSpan in the footer", () => {
    const columnsWithColSpan: ColumnSchema<TestData, CellValue>[] = [
      {
        id: "name",
        header: "Name",
        value: ({ data }) => data?.name,
      },
      {
        id: "value",
        header: "Value",
        value: ({ data }) => data?.value,
        footer: ({ data }) =>
          `Total: ${data?.reduce((acc, item) => acc + item.value, 0)}`,
        footerCellProps: { colSpan: 2 },
      },
    ];

    render(
      <DataTable
        columns={columnsWithColSpan}
        data={testData}
        keyExtractor={(item) => item.id}
      />,
    );

    const footerCell = screen.getByText("Total: 300");
    expect(footerCell).toBeInTheDocument();
    expect(footerCell).toHaveAttribute("colSpan", "2");
  });
});
