import { PortfolioHoldingAPI } from "./portfolio-holdings-api";

describe("Test Suite for PortfolioHoldingAPI", () => {
  describe("getHoldingsByPortfolioConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given portfolioId", () => {
      const portfolioId = "portfolio123";
      const config =
        PortfolioHoldingAPI.getHoldingsByPortfolioConfig(portfolioId);
      expect(config).toEqual({
        url: "/portfolios/portfolio123/holdings",
        method: "get",
      });
    });
  });

  describe("getHoldingListXIRRConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given portfolioId", () => {
      const portfolioId = "portfolio123";
      const config = PortfolioHoldingAPI.getHoldingListXIRRConfig(portfolioId);
      expect(config).toEqual({
        url: "/portfolios/portfolio123/holdings/xirr",
        method: "get",
      });
    });

    it("should return a valid AxiosRequestConfig object for a given portfolioId and viewType", () => {
      const portfolioId = "portfolio123";
      const viewType = "active";
      const config = PortfolioHoldingAPI.getHoldingListXIRRConfig(
        portfolioId,
        viewType,
      );
      expect(config).toEqual({
        url: "/portfolios/portfolio123/holdings/xirr",
        method: "get",
        params: { viewType },
      });
    });
  });

  describe("getOneHoldingConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given portfolioId and holdingId", () => {
      const portfolioId = "portfolio123";
      const holdingId = "holding456";
      const config = PortfolioHoldingAPI.getOneHoldingConfig(
        portfolioId,
        holdingId,
      );
      expect(config).toEqual({
        url: "/portfolios/portfolio123/holdings/holding456",
        method: "get",
      });
    });
  });

  describe("getOneHoldingXIRRConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given portfolioId and holdingId", () => {
      const portfolioId = "portfolio123";
      const holdingId = "holding456";
      const config = PortfolioHoldingAPI.getOneHoldingXIRRConfig(
        portfolioId,
        holdingId,
      );
      expect(config).toEqual({
        url: "/portfolios/portfolio123/holdings/holding456/xirr",
        method: "get",
      });
    });
  });
});
