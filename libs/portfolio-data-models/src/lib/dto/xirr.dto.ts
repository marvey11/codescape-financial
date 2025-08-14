export interface XIRRPortfolioResponseDTO {
  portfolioId: string;
  date: string;
  xirr: number;
}

export interface XIRRPortfolioTransformedDTO {
  portfolioId: string;
  date: Date;
  xirr: number;
}

export interface XIRRHoldingListResponseDTO {
  [isin: string]: {
    date: string;
    xirr: number;
  };
}

export interface XIRRHoldingListTransformedDTO {
  [isin: string]: {
    date: Date;
    xirr: number;
  };
}

export interface XIRRHoldingResponseDTO {
  isin: string;
  date: string;
  xirr: number;
}

export interface XIRRHoldingTransformedDTO {
  isin: string;
  date: Date;
  xirr: number;
}
