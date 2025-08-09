import {
  formatNormalizedDate,
  getDateObject,
  parseNumberWithAutoLocale,
} from "@codescape-financial/core";
import type { RawTransactionDataRow } from "../types";

const transformRawCsvToTransactionData = (data: RawTransactionDataRow) => {
  const convertNumberString = (key: keyof RawTransactionDataRow) => {
    const value = data[key];
    if (typeof value !== "string" || value.trim() === "") return 0;
    return parseNumberWithAutoLocale(value);
  };

  return {
    date: formatNormalizedDate(getDateObject(data.executionDate)),
    shares: Math.abs(convertNumberString("shares")),
    pricePerShare: convertNumberString("pricePerShare"),
    fees: Math.abs(convertNumberString("fees")),
  };
};

export { transformRawCsvToTransactionData };
