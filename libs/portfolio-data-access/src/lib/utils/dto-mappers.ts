import { formatNormalizedDate } from "@codescape-financial/core";
import { mapStockMetadataEntityToEmbeddedDTO } from "@codescape-financial/historical-data-access";
import {
  PortfolioHoldingEmbeddedDTO,
  PortfolioHoldingResponseDTO,
  PortfolioOperationEmbeddedDTO,
  PortfolioResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { Portfolio, PortfolioHolding, PortfolioOperation } from "../entities";

export const mapPortfolioEntityToDto = (
  portfolio: Portfolio,
): PortfolioResponseDTO => {
  const {
    id,
    name,
    description,
    totalCostBasis,
    totalFees,
    totalRealizedGains,
    totalSalesTaxes,
    totalDividends,
    totalDividendTaxes,
    holdings,
  } = portfolio;
  return {
    id,
    name,
    description,
    summary: {
      totalCostBasis: Number(totalCostBasis),
      totalFees: Number(totalFees),
      totalRealizedGains: Number(totalRealizedGains),
      totalTaxFromSoldShares: Number(totalSalesTaxes),
      totalDividends: Number(totalDividends),
      totalTaxFromDividends: Number(totalDividendTaxes),
    },
    holdings: holdings.map(mapPortfolioHoldingEntityToEmbeddedDto),
  } satisfies PortfolioResponseDTO;
};

export const mapPortfolioHoldingEntityToEmbeddedDto = (
  holding: PortfolioHolding,
): PortfolioHoldingEmbeddedDTO =>
  ({
    id: holding.id,
    stock: mapStockMetadataEntityToEmbeddedDTO(holding.stockMetadata),
    summary: {
      averagePricePerShare: Number(holding.averagePricePerShare),
      totalShares: Number(holding.shares),
      totalCostBasis: Number(holding.totalCostBasis),
      totalFees: Number(holding.fees),
      totalRealizedGains: Number(holding.realizedGains),
      totalTaxFromSoldShares: Number(holding.salesTaxes),
      totalDividends: Number(holding.dividends),
      totalTaxFromDividends: Number(holding.totalDividendTaxes),
    },
  }) satisfies PortfolioHoldingEmbeddedDTO;

export const mapPortfolioHoldingEntityToDto = (
  holding: PortfolioHolding,
  portfolioId: string,
): PortfolioHoldingResponseDTO => {
  const { id, stockMetadata, operations } = holding;
  return {
    id,
    portfolioId: portfolioId,
    stock: stockMetadata,
    operations: operations.map(mapPortfolioOperationToDto),
  } satisfies PortfolioHoldingResponseDTO;
};

export const mapPortfolioOperationToDto = (
  operation: PortfolioOperation,
): PortfolioOperationEmbeddedDTO => {
  const {
    id,
    type,
    date,
    numberOfShares,
    pricePerShare,
    applicableShares,
    exchangeRate,
    dividendPerShare,
    splitRatio,
    fees,
    taxes,
  } = operation;
  return {
    id,
    type,
    date: formatNormalizedDate(date),
    shares: Number(numberOfShares),
    pricePerShare: Number(pricePerShare),
    applicableShares: Number(applicableShares),
    dividendPerShare: Number(dividendPerShare),
    splitRatio: Number(splitRatio),
    exchangeRate: Number(exchangeRate),
    fees: Number(fees),
    taxes: Number(taxes),
  } satisfies PortfolioOperationEmbeddedDTO;
};
