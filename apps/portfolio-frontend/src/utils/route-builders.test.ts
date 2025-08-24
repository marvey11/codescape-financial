import {
  buildAddOperationRoute,
  buildCountryDetailsRoute,
  buildEditCountryRoute,
  buildEditPortfolioRoute,
  buildEditStockRoute,
  buildPortfolioDetailsRoute,
  buildPortfolioHoldingDetailsRoute,
  buildStockDetailsRoute,
} from "./route-builders";

describe("Route Builders", () => {
  describe("Country Routes", () => {
    it("should build the correct country details route", () => {
      const countryId = "123";
      expect(buildCountryDetailsRoute(countryId)).toBe("/countries/123");
    });

    it("should build the correct edit country route", () => {
      const countryId = "123";
      expect(buildEditCountryRoute(countryId)).toBe("/countries/123/edit");
    });
  });

  describe("Stock Routes", () => {
    it("should build the correct stock details route", () => {
      const stockId = "456";
      expect(buildStockDetailsRoute(stockId)).toBe("/stocks/456");
    });

    it("should build the correct edit stock route", () => {
      const stockId = "456";
      expect(buildEditStockRoute(stockId)).toBe("/stocks/456/edit");
    });
  });

  describe("Portfolio Routes", () => {
    it("should build the correct portfolio details route", () => {
      const portfolioId = "789";
      expect(buildPortfolioDetailsRoute(portfolioId)).toBe("/portfolios/789");
    });

    it("should build the correct edit portfolio route", () => {
      const portfolioId = "789";
      expect(buildEditPortfolioRoute(portfolioId)).toBe("/portfolios/789/edit");
    });
  });

  describe("Portfolio Holdings Routes", () => {
    it("should build the correct portfolio holding details route", () => {
      const portfolioId = "789";
      const holdingId = "abc";
      expect(buildPortfolioHoldingDetailsRoute(portfolioId, holdingId)).toBe(
        "/portfolios/789/holdings/abc",
      );
    });

    it("should build the correct add operation route with stockId query param", () => {
      const portfolioId = "789";
      const holdingId = "abc";
      const stockId = "xyz";
      expect(buildAddOperationRoute(portfolioId, holdingId, stockId)).toBe(
        "/portfolios/789/holdings/abc/operations/add?stockId=xyz",
      );
    });
  });
});
