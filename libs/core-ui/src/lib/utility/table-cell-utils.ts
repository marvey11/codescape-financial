import { CellValue } from "../components";

export const createNumberValueCellClassNames = (cellValue: CellValue) => {
  if (typeof cellValue === "number") {
    if (cellValue > 0) {
      return "text-green-500";
    }
    if (cellValue < 0) {
      return "text-red-500";
    }
  }
  return "";
};
