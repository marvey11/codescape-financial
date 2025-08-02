import {
  formatNormalizedDate,
  getDateObject,
  parseNumberWithAutoLocale,
} from "@codescape-financial/core";
import { HistoricalQuote } from "@codescape-financial/historical-data-access";
import { RawQuoteDataRow } from "./parser-types";

type AssignableNumberString = "open" | "low" | "high" | "close" | "volume";

const transformRawCsvToPartialHistoricalQuote = (
  data: RawQuoteDataRow,
): Partial<HistoricalQuote> => {
  const convertNumberString = (key: AssignableNumberString) =>
    parseNumberWithAutoLocale(data[key as AssignableNumberString]).toString();

  return {
    date: formatNormalizedDate(getDateObject(data.date)),
    open: convertNumberString("open"),
    low: convertNumberString("low"),
    high: convertNumberString("high"),
    close: convertNumberString("close"),
    volume: convertNumberString("volume"),
  };
};

export { transformRawCsvToPartialHistoricalQuote };
