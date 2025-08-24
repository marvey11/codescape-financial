import { HistoricalQuoteAPI } from "./historical-quotes-api";

describe("Test Suite for HistoricalQuoteAPI", () => {
  describe("getAllQuotesConfig", () => {
    it("should return a valid AxiosRequestConfig object", () => {
      const config = HistoricalQuoteAPI.getAllQuotesConfig();
      expect(config).toEqual({
        url: "/historical-quotes",
        method: "get",
      });
    });
  });

  describe("getAddHistoricalQuoteConfig", () => {
    it("should return a valid AxiosRequestConfig object for adding a historical quote", () => {
      const payload = {
        isin: "US0378331005",
        date: "2023-01-01",
        price: 100,
        currency: "USD",
      };
      const config = HistoricalQuoteAPI.getAddHistoricalQuoteConfig(payload);
      expect(config).toEqual({
        url: "/historical-quotes",
        method: "post",
        data: payload,
      });
    });
  });

  describe("getHistoricalQuoteByIdConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given ID", () => {
      const quoteId = "123";
      const config = HistoricalQuoteAPI.getHistoricalQuoteByIdConfig(quoteId);
      expect(config).toEqual({
        url: "/historical-quotes/123",
        method: "get",
      });
    });

    it("should throw an error if quoteId is an empty string", () => {
      expect(() => HistoricalQuoteAPI.getHistoricalQuoteByIdConfig("")).toThrow(
        "Historical quote ID must be a non-empty string.",
      );
    });

    it("should throw an error if quoteId is a whitespace string", () => {
      expect(() =>
        HistoricalQuoteAPI.getHistoricalQuoteByIdConfig("   "),
      ).toThrow("Historical quote ID must be a non-empty string.");
    });
  });

  describe("getUpdateHistoricalQuoteConfig", () => {
    it("should return a valid AxiosRequestConfig object for updating a historical quote", () => {
      const quoteId = "123";
      const payload = {
        isin: "US0378331005",
        date: "2023-01-01",
        price: 100,
        currency: "USD",
      };
      const config = HistoricalQuoteAPI.getUpdateHistoricalQuoteConfig(
        quoteId,
        payload,
      );
      expect(config).toEqual({
        url: "/historical-quotes/123",
        method: "put",
        data: payload,
      });
    });

    it("should throw an error if quoteId is an empty string", () => {
      const payload = {
        isin: "US0378331005",
        date: "2023-01-01",
        price: 100,
        currency: "USD",
      };
      expect(() =>
        HistoricalQuoteAPI.getUpdateHistoricalQuoteConfig("", payload),
      ).toThrow("Historical quote ID must be a non-empty string.");
    });
  });

  describe("getDeleteHistoricalQuoteConfig", () => {
    it("should return a valid AxiosRequestConfig object for deleting a historical quote", () => {
      const quoteId = "123";
      const config = HistoricalQuoteAPI.getDeleteHistoricalQuoteConfig(quoteId);
      expect(config).toEqual({
        url: "/historical-quotes/123",
        method: "delete",
      });
    });

    it("should throw an error if quoteId is an empty string", () => {
      expect(() =>
        HistoricalQuoteAPI.getDeleteHistoricalQuoteConfig(""),
      ).toThrow("Historical quote ID must be a non-empty string.");
    });
  });

  describe("getLatestQuoteByISINConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given ISIN", () => {
      const isin = "US0378331005";
      const config = HistoricalQuoteAPI.getLatestQuoteByISINConfig(isin);
      expect(config).toEqual({
        url: "/historical-quotes/US0378331005/latest",
        method: "get",
      });
    });

    it("should throw an error if isin is an empty string", () => {
      expect(() => HistoricalQuoteAPI.getLatestQuoteByISINConfig("")).toThrow(
        "ISIN must be a non-empty string.",
      );
    });

    it("should throw an error if isin is a whitespace string", () => {
      expect(() =>
        HistoricalQuoteAPI.getLatestQuoteByISINConfig("   "),
      ).toThrow("ISIN must be a non-empty string.");
    });
  });

  describe("getLatestQuotesBatchConfig", () => {
    it("should return a valid AxiosRequestConfig object for a batch of ISINs", () => {
      const payload = { isins: ["US0378331005", "US5949181045"] };
      const config = HistoricalQuoteAPI.getLatestQuotesBatchConfig(payload);
      expect(config).toEqual({
        url: "/historical-quotes/latest-batch",
        method: "post",
        data: payload,
      });
    });

    it("should throw an error if isins array is empty", () => {
      const payload = { isins: [] };
      expect(() =>
        HistoricalQuoteAPI.getLatestQuotesBatchConfig(payload),
      ).toThrow("ISIN array must not be empty.");
    });

    it("should throw an error if isins array contains empty strings", () => {
      const payload = { isins: ["US0378331005", ""] };
      expect(() =>
        HistoricalQuoteAPI.getLatestQuotesBatchConfig(payload),
      ).toThrow("ISIN array must not contain empty strings.");
    });

    it("should throw an error if isins array contains whitespace strings", () => {
      const payload = { isins: ["US0378331005", "   "] };
      expect(() =>
        HistoricalQuoteAPI.getLatestQuotesBatchConfig(payload),
      ).toThrow("ISIN array must not contain empty strings.");
    });
  });
});
