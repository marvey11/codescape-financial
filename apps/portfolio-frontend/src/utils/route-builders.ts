import { ROUTES } from "../config/routes";

// STOCKS

export const buildCountryDetailsRoute = (countryId: string) =>
  ROUTES.COUNTRY_DETAILS.replace(":id", countryId);

export const buildEditCountryRoute = (countryId: string) =>
  ROUTES.EDIT_COUNTRY.replace(":id", countryId);

// STOCKS

export const buildStockDetailsRoute = (stockId: string) =>
  ROUTES.STOCK_DETAILS.replace(":id", stockId);

export const buildEditStockRoute = (stockId: string) =>
  ROUTES.EDIT_STOCK.replace(":id", stockId);

// PORTFOLIOS

export const buildPortfolioDetailsRoute = (portfolioId: string) =>
  ROUTES.PORTFOLIO_DETAILS.replace(":portfolioId", portfolioId);

export const buildEditPortfolioRoute = (portfolioId: string) =>
  ROUTES.EDIT_PORTFOLIO.replace(":portfolioId", portfolioId);

// PORTFOLIO HOLDINGS

export const buildPortfolioHoldingDetailsRoute = (
  portfolioId: string,
  holdingId: string,
) =>
  ROUTES.PORTFOLIO_HOLDING_DETAILS.replace(":portfolioId", portfolioId).replace(
    ":holdingId",
    holdingId,
  );

export const buildAddOperationRoute = (
  portfolioId: string,
  holdingId: string,
  stockId: string,
) => {
  const baseRoute = ROUTES.ADD_PORTFOLIO_HOLDING_OPERATION.replace(
    ":portfolioId",
    portfolioId,
  ).replace(":holdingId", holdingId);
  const queryString = new URLSearchParams({ stockId }).toString();
  return `${baseRoute}?${queryString}`;
};
