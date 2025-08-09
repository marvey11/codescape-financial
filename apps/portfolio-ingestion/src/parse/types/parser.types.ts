export interface RawQuoteDataRow {
  date: string;
  open: string;
  low: string;
  high: string;
  close: string;
  volume: string;
}

export interface RawTransactionDataRow {
  processingDate: string;
  executionDate: string;
  isin: string;
  type: "Kauf" | "Verkauf";
  shares: string;
  pricePerShare: string;
  fees: string;
}
