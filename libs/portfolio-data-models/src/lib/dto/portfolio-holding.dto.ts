import { StockEmbeddedDTO } from "./stock.dto.js";

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
