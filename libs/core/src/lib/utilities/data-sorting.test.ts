import { sortDataArray } from "./data-sorting.js";

describe("Test Suite for sortDataArray", () => {
  interface TestItem {
    name: string;
    value: number;
    date?: Date | null | undefined;
  }

  const data: TestItem[] = [
    { name: "Banana", value: 3 },
    { name: "Apple", value: 1 },
    { name: "Cherry", value: 2 },
    { name: "apple", value: 4 }, // Test case for case-insensitive string sort
    { name: "Date", value: 5, date: new Date("2023-01-01") },
    { name: "Elderberry", value: 6, date: new Date("2023-01-03") },
    { name: "Fig", value: 7, date: new Date("2023-01-02") },
    { name: "Grape", value: 8, date: null }, // Test case for null date
    { name: "Honeydew", value: 9, date: undefined }, // Test case for undefined date
  ];

  it("should sort by string key in ascending order (case-insensitive)", () => {
    const sorted = sortDataArray(data, "name", "asc");
    expect(sorted.map((item) => item.name)).toEqual([
      "Apple",
      "apple",
      "Banana",
      "Cherry",
      "Date",
      "Elderberry",
      "Fig",
      "Grape",
      "Honeydew",
    ]);
  });

  it("should sort by string key in descending order (case-insensitive)", () => {
    const sorted = sortDataArray(data, "name", "desc");
    expect(sorted.map((item) => item.name)).toEqual([
      "Honeydew",
      "Grape",
      "Fig",
      "Elderberry",
      "Date",
      "Cherry",
      "Banana",
      "Apple", // stable sort --> `Apple` before `apple`
      "apple",
    ]);
  });

  it("should sort by number key in ascending order", () => {
    const sorted = sortDataArray(data, "value", "asc");
    expect(sorted.map((item) => item.value)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  it("should sort by number key in descending order", () => {
    const sorted = sortDataArray(data, "value", "desc");
    expect(sorted.map((item) => item.value)).toEqual([
      9, 8, 7, 6, 5, 4, 3, 2, 1,
    ]);
  });

  it("should sort by date key in ascending order, with nulls/undefined at the end", () => {
    const sorted = sortDataArray(data, "date", "asc");
    const sortedDates = sorted.map((item) => item.date);

    // Check that the valid dates are first and in order
    expect(sortedDates.slice(0, 3)).toEqual([
      new Date("2023-01-01"),
      new Date("2023-01-02"),
      new Date("2023-01-03"),
    ]);

    // Check that the remaining items are null or undefined
    sortedDates.slice(3).forEach((date) => expect(date == null).toBeTruthy());
  });

  it("should sort by date key in descending order, with nulls/undefined at the end", () => {
    const sorted = sortDataArray(data, "date", "desc");
    const sortedDates = sorted.map((item) => item.date);

    // Check that the valid dates are first and in order
    expect(sortedDates.slice(0, 3)).toEqual([
      new Date("2023-01-03"),
      new Date("2023-01-02"),
      new Date("2023-01-01"),
    ]);

    // Check that the remaining items are null or undefined
    sortedDates.slice(3).forEach((date) => expect(date == null).toBeTruthy());
  });

  describe("when sorting by a nested property using an extractor function", () => {
    interface NestedItem {
      id: number;
      details: {
        name: string;
        priority: number;
      };
    }

    const nestedData: NestedItem[] = [
      { id: 3, details: { name: "Charlie", priority: 2 } },
      { id: 1, details: { name: "Alpha", priority: 3 } },
      { id: 2, details: { name: "Bravo", priority: 1 } },
    ];

    it("should sort by nested string property ascending", () => {
      const sorted = sortDataArray(nestedData, (item) => item.details.name);
      expect(sorted.map((item) => item.id)).toEqual([1, 2, 3]);
    });

    it("should sort by nested string property descending", () => {
      const sorted = sortDataArray(
        nestedData,
        (item) => item.details.name,
        "desc",
      );
      expect(sorted.map((item) => item.id)).toEqual([3, 2, 1]);
    });

    it("should sort by nested number property ascending", () => {
      const sorted = sortDataArray(nestedData, (item) => item.details.priority);
      expect(sorted.map((item) => item.id)).toEqual([2, 3, 1]);
    });

    it("should sort by nested number property descending", () => {
      const sorted = sortDataArray(
        nestedData,
        (item) => item.details.priority,
        "desc",
      );
      expect(sorted.map((item) => item.id)).toEqual([1, 3, 2]);
    });
  });
});
