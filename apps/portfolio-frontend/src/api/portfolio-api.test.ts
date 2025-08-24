import { PortfolioAPI } from "./portfolio-api";

describe("Test Suite for PortfolioAPI", () => {
  describe("getAllPortfoliosConfig", () => {
    it("should return a valid AxiosRequestConfig object", () => {
      const config = PortfolioAPI.getAllPortfoliosConfig();
      expect(config).toEqual({
        url: "/portfolios",
        method: "get",
      });
    });
  });

  describe("getPortfolioByIdConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given ID", () => {
      const portfolioId = "123";
      const config = PortfolioAPI.getPortfolioByIdConfig(portfolioId);
      expect(config).toEqual({
        url: "/portfolios/123",
        method: "get",
      });
    });

    it("should throw an error if portfolioId is an empty string", () => {
      expect(() => PortfolioAPI.getPortfolioByIdConfig("")).toThrow(
        "Portfolio ID must be a non-empty string.",
      );
    });

    it("should throw an error if portfolioId is a whitespace string", () => {
      expect(() => PortfolioAPI.getPortfolioByIdConfig("   ")).toThrow(
        "Portfolio ID must be a non-empty string.",
      );
    });
  });

  describe("getAddPortfolioConfig", () => {
    it("should return a valid AxiosRequestConfig object for adding a portfolio", () => {
      const payload = { name: "Test Portfolio" };
      const config = PortfolioAPI.getAddPortfolioConfig(payload);
      expect(config).toEqual({
        url: "/portfolios",
        method: "post",
        data: payload,
      });
    });
  });

  describe("getEditPortfolioConfig", () => {
    it("should return a valid AxiosRequestConfig object for editing a portfolio", () => {
      const portfolioId = "123";
      const payload = { name: "Updated Portfolio" };
      const config = PortfolioAPI.getEditPortfolioConfig(portfolioId, payload);
      expect(config).toEqual({
        url: "/portfolios/123",
        method: "put",
        data: payload,
      });
    });

    it("should throw an error if portfolioId is an empty string", () => {
      const payload = { name: "Updated Portfolio" };
      expect(() => PortfolioAPI.getEditPortfolioConfig("", payload)).toThrow(
        "Portfolio ID must be a non-empty string.",
      );
    });
  });

  describe("getDeletePortfolioConfig", () => {
    it("should return a valid AxiosRequestConfig object for deleting a portfolio", () => {
      const portfolioId = "123";
      const config = PortfolioAPI.getDeletePortfolioConfig(portfolioId);
      expect(config).toEqual({
        url: "/portfolios/123",
        method: "delete",
      });
    });

    it("should throw an error if portfolioId is an empty string", () => {
      expect(() => PortfolioAPI.getDeletePortfolioConfig("")).toThrow(
        "Portfolio ID must be a non-empty string.",
      );
    });
  });

  describe("getPortfolioXirrConfig", () => {
    it("should return a valid AxiosRequestConfig object for getting portfolio XIRR", () => {
      const portfolioId = "123";
      const config = PortfolioAPI.getPortfolioXirrConfig(portfolioId);
      expect(config).toEqual({
        url: "/portfolios/123/xirr",
        method: "get",
      });
    });

    it("should return a valid AxiosRequestConfig object for getting portfolio XIRR with viewType", () => {
      const portfolioId = "123";
      const viewType = "active";
      const config = PortfolioAPI.getPortfolioXirrConfig(portfolioId, viewType);
      expect(config).toEqual({
        url: "/portfolios/123/xirr",
        method: "get",
        params: { viewType },
      });
    });

    it("should throw an error if portfolioId is an empty string", () => {
      expect(() => PortfolioAPI.getPortfolioXirrConfig("")).toThrow(
        "Portfolio ID must be a non-empty string.",
      );
    });
  });

  describe("getPortfolioAllocationsConfig", () => {
    it("should return a valid AxiosRequestConfig object for getting portfolio allocations", () => {
      const portfolioId = "123";
      const config = PortfolioAPI.getPortfolioAllocationsConfig(portfolioId);
      expect(config).toEqual({
        url: "/portfolios/123/allocations",
        method: "get",
      });
    });

    it("should throw an error if portfolioId is an empty string", () => {
      expect(() => PortfolioAPI.getPortfolioAllocationsConfig("")).toThrow(
        "Portfolio ID must be a non-empty string.",
      );
    });
  });
});
