export const ROUTES = {
  // countries
  COUNTRIES: "/countries",
  ADD_COUNTRY: "/countries/add",
  COUNTRY_DETAILS: "/countries/:id",
  EDIT_COUNTRY: "/countries/:id/edit",

  // stocks
  STOCKS: "/stocks",
  ADD_STOCK: "/stocks/add",
  STOCK_DETAILS: "/stocks/:id",
  EDIT_STOCK: "/stocks/:id/edit",

  // portfolios
  PORTFOLIOS: "/portfolios",
  ADD_PORTFOLIO: "/portfolios/add",
  PORTFOLIO_DETAILS: "/portfolios/:portfolioId",
  EDIT_PORTFOLIO: "/portfolios/:portfolioId/edit",

  // portfolio holdings
  PORTFOLIO_HOLDING_DETAILS: "/portfolios/:portfolioId/holdings/:holdingId",

  // operations
  ADD_PORTFOLIO_HOLDING_OPERATION:
    "/portfolios/:portfolioId/holdings/:holdingId/operations/add",
};
