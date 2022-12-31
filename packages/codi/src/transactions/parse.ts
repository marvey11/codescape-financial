import { TransactionType } from "@csfin/core";
import { parse } from "csv-parse";
import fs from "fs";
import { finished } from "stream/promises";
import { CSVParseOptions, TransactionData } from "./types";
import { parseDateStringDE, parseNumberStringDE } from "./utils";

const defaultOptions: CSVParseOptions = {
  delimiter: ","
};

/**
 * Parses one or more CSV files and returns the resulting records transformed into `TransactionData` objects (wrapped in a Promise).
 *
 * @param pathOrPaths the CSV file path or paths to parse
 * @param options the options to use for CSV parsing; use this to specify CSV delimiters and more
 * @returns the array of transaction data objects
 */
export const parseFromCSV = async (pathOrPaths: string | string[], options: CSVParseOptions = defaultOptions) => {
  const allData = await parseAllData(pathOrPaths, options);
  return allData.map(transform);
};

/**
 * Parses one or more CSV files and returns the resulting records a flattened array (wrapped in a Promise).
 *
 * @param pathOrPaths the CSV file path or paths to parse
 * @param options the options to use for CSV parsing
 * @returns the flattened array of CSV records
 */
const parseAllData = async (pathOrPaths: string | string[], options: CSVParseOptions) => {
  if (Array.isArray(pathOrPaths)) {
    // transform each path into an array of records (wrapped in a Promise), then use concat to flatten
    return Promise.all(pathOrPaths.map((path) => parseCSVFile(path, options))).then((result) =>
      result.reduce((prev, curr) => prev.concat(curr), [] as Record<string, string>[])
    );
  }

  // `pathOrPaths` is a single path at this point
  return parseCSVFile(pathOrPaths, options);
};

/**
 * Parses a single CSV file and returns its contents as an array of record (wrapped in a Promise).
 *
 * @param csvFilePath the path to the CSV file to parse
 * @param options the options to use for CSV parsing
 * @returns the CSV records
 */
const parseCSVFile = async (csvFilePath: string, options: CSVParseOptions) => {
  // implementation based on https://csv.js.org/parse/recipes/promises/
  const data: Record<string, string>[] = [];

  const parser = fs.createReadStream(csvFilePath).pipe(parse({ columns: true, delimiter: options.delimiter }));

  parser.on("readable", () => {
    let record;
    while ((record = parser.read()) !== null) {
      data.push(record);
    }
  });

  await finished(parser);

  return data;
};

/**
 * Transforms a single CSV record into a `TransactionData` object.
 *
 * @param record the CSV record to transform
 * @returns the newly created `TransactionData` object
 */
const transform = (record: Record<string, string>) => {
  const {
    ISIN: isin,
    WKN: nsin,
    Bezeichnung: name,
    Geschäftsart: type,
    "Datum Ausführung": date,
    "Stücke/Nom.": shares,
    "Kundenendbetrag EUR": price
  } = record;

  return {
    isin: isin,
    nsin: nsin,
    name: name,
    type: transformTransactionType(type),
    date: parseDateStringDE(date),
    shares: parseNumberStringDE(shares),
    price: -parseNumberStringDE(price)
  } as TransactionData;
};

/**
 * Transforms the transaction type from the CSV record to an instance of the `TransactionType` enum.
 *
 * @param recordType the transaction type as read from the CSV record
 * @returns the transformed transaction type
 * @throws an error if the type could not be recognised
 */
const transformTransactionType = (recordType: string) => {
  if (recordType === "Kauf") return TransactionType.BUY;
  if (recordType === "Verkauf") return TransactionType.SELL;
  throw new Error(`Unrecognised Transaction Type: ${recordType}`);
};
