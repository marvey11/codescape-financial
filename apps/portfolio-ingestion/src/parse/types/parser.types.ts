export interface RawTransactionDataRow {
  processingDate: string;
  executionDate: string;
  isin: string;
  type: "Kauf" | "Verkauf";
  shares: string;
  pricePerShare: string;
  fees: string;
}
