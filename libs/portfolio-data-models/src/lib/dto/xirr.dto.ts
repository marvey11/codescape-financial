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

export interface XIRRHoldingBatchResponseDTO {
  [isin: string]: {
    date: string;
    xirr: number;
  };
}

export interface XIRRHoldingBatchTransformedDTO {
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
