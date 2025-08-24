import {
  CreateBuyTransactionDTO,
  CreateDividendDTO,
  CreateSellTransactionDTO,
  CreateStockSplitDTO,
} from "@codescape-financial/portfolio-data-models";
import { PortfolioOperationsAPI } from "./portfolio-operations-api";

describe("Test Suite for PortfolioOperationsAPI", () => {
  describe("getAllOperationsConfig", () => {
    it("should return a valid AxiosRequestConfig object", () => {
      const config = PortfolioOperationsAPI.getAllOperationsConfig();
      expect(config).toEqual({
        url: "/portfolio-operations",
        method: "get",
      });
    });
  });

  describe("getBuyOperationConfig", () => {
    it("should return a valid AxiosRequestConfig object for a buy operation", () => {
      const payload: CreateBuyTransactionDTO = {
        portfolioId: "portfolio123",
        stockId: "stock456",
        date: "2023-01-01",
        shares: 10,
        pricePerShare: 100,
        fees: 5,
      };
      const config = PortfolioOperationsAPI.getBuyOperationConfig(payload);
      expect(config).toEqual({
        url: "/portfolio-operations/buy",
        method: "post",
        data: expect.objectContaining(payload),
      });
    });
  });

  describe("getSellOperationConfig", () => {
    it("should return a valid AxiosRequestConfig object for a sell operation", () => {
      const payload: CreateSellTransactionDTO = {
        portfolioId: "portfolio123",
        stockId: "stock456",
        date: "2023-01-01",
        shares: 5,
        pricePerShare: 120,
        fees: 5,
      };
      const config = PortfolioOperationsAPI.getSellOperationConfig(payload);
      expect(config).toEqual({
        url: "/portfolio-operations/sell",
        method: "post",
        data: expect.objectContaining(payload),
      });
    });
  });

  describe("getStockSplitOperationConfig", () => {
    it("should return a valid AxiosRequestConfig object for a stock split operation", () => {
      const payload: CreateStockSplitDTO = {
        portfolioId: "portfolio123",
        stockId: "stock456",
        date: "2023-01-01",
        splitRatio: 2,
      };
      const config =
        PortfolioOperationsAPI.getStockSplitOperationConfig(payload);
      expect(config).toEqual({
        url: "/portfolio-operations/stock-split",
        method: "post",
        data: expect.objectContaining(payload),
      });
    });
  });

  describe("getDividendOperationConfig", () => {
    it("should return a valid AxiosRequestConfig object for a dividend operation", () => {
      const payload: CreateDividendDTO = {
        portfolioId: "portfolio123",
        stockId: "stock456",
        date: "2023-01-01",
        dividendPerShare: 10,
        applicableShares: 5,
        exchangeRate: 1.25,
      };
      const config = PortfolioOperationsAPI.getDividendOperationConfig(payload);
      expect(config).toEqual({
        url: "/portfolio-operations/dividend",
        method: "post",
        data: expect.objectContaining(payload),
      });
    });
  });
});
