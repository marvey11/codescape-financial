export interface QuoteObject {
  date: Date;
  price: number;
}

export type LatestQuoteMapping = Map<string, QuoteObject>;
