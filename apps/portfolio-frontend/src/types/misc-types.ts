export interface QuoteObject {
  date: Date;
  price: number;
}

export type LatestQuoteMapping = Map<string, QuoteObject>;

export interface XIRRObject {
  date: Date;
  xirr: number;
}

export type XIRRMapping = Map<string, XIRRObject>;
