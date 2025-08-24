import { PortfolioViewType } from "../types";
import { formatNormalizedDate } from "./formatters";

export const generatePortfolioXirrKey = (
  portfolioId: string,
  viewType: PortfolioViewType,
) =>
  `xirr:portfolio:${portfolioId}:${viewType}:${formatNormalizedDate(new Date())}`;

export const generateHoldingListXirrKey = (
  portfolioId: string,
  viewType: PortfolioViewType,
) =>
  `xirr:portfolio:${portfolioId}:holdings:${viewType}:${formatNormalizedDate(new Date())}`;

export const generateHoldingXirrKey = (
  portfolioId: string,
  holdingId: string,
) => `xirr:${portfolioId}:${holdingId}:${formatNormalizedDate(new Date())}`;

export const generatePortfolioAllocationKey = (portfolioId: string) =>
  `allocation:${portfolioId}:${formatNormalizedDate(new Date())}`;
