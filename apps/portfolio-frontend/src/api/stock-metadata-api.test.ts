import { StockMetadataAPI } from "./stock-metadata-api";

describe("Test Suite for StockMetadataAPI", () => {
  describe("getAllStocksConfig", () => {
    it("should return a valid AxiosRequestConfig object", () => {
      const config = StockMetadataAPI.getAllStocksConfig();
      expect(config).toEqual({
        url: "/stock-metadata",
        method: "get",
      });
    });

    it("should return a valid AxiosRequestConfig object with countryId", () => {
      const config = StockMetadataAPI.getAllStocksConfig("USA");
      expect(config).toEqual({
        url: "/stock-metadata",
        method: "get",
        params: { countryId: "USA" },
      });
    });

    it("should throw an error if countryId is an empty string", () => {
      expect(() => StockMetadataAPI.getAllStocksConfig("")).toThrow(
        "Country ID must be a non-empty string.",
      );
    });

    it("should throw an error if countryId is a whitespace string", () => {
      expect(() => StockMetadataAPI.getAllStocksConfig("   ")).toThrow(
        "Country ID must be a non-empty string.",
      );
    });
  });

  describe("getStockByIdConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given ID", () => {
      const stockId = "123";
      const config = StockMetadataAPI.getStockByIdConfig(stockId);
      expect(config).toEqual({
        url: "/stock-metadata/123",
        method: "get",
      });
    });

    it("should throw an error if stockId is an empty string", () => {
      expect(() => StockMetadataAPI.getStockByIdConfig("")).toThrow(
        "Stock ID must be a non-empty string.",
      );
    });

    it("should throw an error if stockId is a whitespace string", () => {
      expect(() => StockMetadataAPI.getStockByIdConfig("   ")).toThrow(
        "Stock ID must be a non-empty string.",
      );
    });
  });

  describe("getAddStockConfig", () => {
    it("should return a valid AxiosRequestConfig object for adding a stock", () => {
      const payload = {
        name: "Test Stock",
        isin: "US1234567890",
        nsin: "ABC123",
        currency: "USD",
        countryId: "1",
      };
      const config = StockMetadataAPI.getAddStockConfig(payload);
      expect(config).toEqual({
        url: "/stock-metadata",
        method: "post",
        data: payload,
      });
    });
  });

  describe("getEditStockConfig", () => {
    it("should return a valid AxiosRequestConfig object for editing a stock", () => {
      const stockId = "123";
      const payload = {
        name: "Updated Stock",
        symbol: "UPD",
        isin: "US0987654321",
        countryId: "2",
      };
      const config = StockMetadataAPI.getEditStockConfig(stockId, payload);
      expect(config).toEqual({
        url: "/stock-metadata/123",
        method: "put",
        data: payload,
      });
    });

    it("should throw an error if stockId is an empty string", () => {
      const payload = {
        name: "Updated Stock",
        symbol: "UPD",
        isin: "US0987654321",
        countryId: "2",
      };
      expect(() => StockMetadataAPI.getEditStockConfig("", payload)).toThrow(
        "Stock ID must be a non-empty string.",
      );
    });
  });

  describe("getDeleteStockConfig", () => {
    it("should return a valid AxiosRequestConfig object for deleting a stock", () => {
      const stockId = "123";
      const config = StockMetadataAPI.getDeleteStockConfig(stockId);
      expect(config).toEqual({
        url: "/stock-metadata/123",
        method: "delete",
      });
    });

    it("should throw an error if stockId is an empty string", () => {
      expect(() => StockMetadataAPI.getDeleteStockConfig("")).toThrow(
        "Stock ID must be a non-empty string.",
      );
    });
  });
});
