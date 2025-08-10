import { StockEmbeddedDTO } from "./stock.dto";

export interface PortfolioHoldingBaseDTO {
  id: string;
  portfolioId: string;
  stock: StockEmbeddedDTO;
}

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
