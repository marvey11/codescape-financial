export const sortDataArray = <T>(
  data: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc",
) => {
  const tmpArray = [...data];
  tmpArray.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    // Keep nulls/undefined at the end regardless of sort order
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    let comparison = 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      // Use localeCompare for proper string sorting, matching existing app logic
      comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
    } else {
      // Basic comparison for numbers, dates, etc.
      if (aVal < bVal) {
        comparison = -1;
      } else if (aVal > bVal) {
        comparison = 1;
      }
    }

    // Flip comparison for descending order
    return order === "desc" ? -comparison : comparison;
  });

  return tmpArray;
};
