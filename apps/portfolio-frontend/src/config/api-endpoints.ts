export const API_ENDPOINTS = {
  // countries
  COUNTRIES: "/countries",
  COUNTRY_BY_ID: "/countries/:id",

  // stocks
  STOCKS: "/stock-metadata",
  STOCK_BY_ID: "/stock-metadata/:id",

  // historical quotes
  QUOTES: "/historical-quotes",
  LATEST_QUOTE_BY_ISIN: "/historical-quotes/:isin/latest",
  LATEST_QUOTES_BATCH: "/historical-quotes/latest-batch",
  QUOTE_BY_ID: "/historical-quotes/:id",

  // portfolios
  PORTFOLIOS: "/portfolios",
  PORTFOLIO_BY_ID: "/portfolios/:id",
  PORTFOLIO_XIRR: "/portfolios/:id/xirr",
  PORTFOLIO_ALLOCATIONS: "/portfolios/:id/allocations",

  // portfolio holdings
  PORTFOLIO_HOLDINGS: "/portfolios/:portfolioId/holdings",
  PORTFOLIO_HOLDING_BATCH_XIRR: "/portfolios/:portfolioId/holdings/xirr",
  PORTFOLIO_HOLDING_BY_ID: "/portfolios/:portfolioId/holdings/:holdingId",
  PORTFOLIO_HOLDING_XIRR: "/portfolios/:portfolioId/holdings/:holdingId/xirr",

  // portfolio operations
  PORTFOLIO_OPERATIONS: "/portfolio-operations",
  PORTFOLIO_BUY_OPERATION: "/portfolio-operations/buy",
  PORTFOLIO_SELL_OPERATION: "/portfolio-operations/sell",
  PORTFOLIO_STOCK_SPLIT_OPERATION: "/portfolio-operations/stock-split",
  PORTFOLIO_DIVIDEND_OPERATION: "/portfolio-operations/dividend",
};
