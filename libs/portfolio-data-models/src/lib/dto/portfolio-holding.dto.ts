import { StockEmbeddedDTO } from "./stock.dto";

export interface PortfolioHoldingEmbeddedDTO {
  id: string;
  stock: StockEmbeddedDTO;
  summary: {
    totalShares?: number;
    totalCostBasis?: number;
    averagePricePerShare?: number;
    totalFees?: number;
    totalRealizedGains?: number;
    totalTaxFromSoldShares?: number;
    totalDividends?: number;
    totalTaxFromDividends?: number;
  };
}

export interface PortfolioHoldingXIRRResponseDTO {
  isin: string;
  xirr: number;
}

export interface PortfolioHoldingXIRRBatchResponseDTO {
  [isin: string]: number;
}
