import {
  PortfolioOperationEmbeddedDTO,
  PortfolioOperationTransformedDTO,
} from "./operation.dto";
import { StockEmbeddedDTO } from "./stock.dto";

export interface PortfolioHoldingResponseDTO {
  id: string;
  portfolioId: string;
  stock: StockEmbeddedDTO;
  operations: PortfolioOperationEmbeddedDTO[];
}

export interface PortfolioHoldingTransformedDTO {
  id: string;
  portfolioId: string;
  stock: StockEmbeddedDTO;
  operations: PortfolioOperationTransformedDTO[];
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
