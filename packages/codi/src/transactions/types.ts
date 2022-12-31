import { TransactionType } from "@csfin/core";

interface TransactionData {
  isin: string;
  nsin: string;
  name: string;
  type: TransactionType;
  date: Date;
  shares: number;
  price: number;
}

interface CSVParseOptions {
  delimiter?: string;
}

export type { CSVParseOptions, TransactionData };
