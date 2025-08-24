import { CreateCountryDTO } from "@codescape-financial/portfolio-data-models";
import { CountryAPI } from "./country-api";

describe("Test Suite for CountryAPI", () => {
  describe("getAllCountriesConfig", () => {
    it("should return a valid AxiosRequestConfig object", () => {
      const config = CountryAPI.getAllCountriesConfig();
      expect(config).toEqual({
        url: "/countries",
        method: "get",
      });
    });
  });

  describe("getCountryByIdConfig", () => {
    it("should return a valid AxiosRequestConfig object for a given ID", () => {
      const countryId = "123";
      const config = CountryAPI.getCountryByIdConfig(countryId);
      expect(config).toEqual({
        url: "/countries/123",
        method: "get",
      });
    });

    it("should throw an error if countryId is an empty string", () => {
      expect(() => CountryAPI.getCountryByIdConfig("")).toThrow(
        "Country ID must be a non-empty string.",
      );
    });

    it("should throw an error if countryId is a whitespace string", () => {
      expect(() => CountryAPI.getCountryByIdConfig("   ")).toThrow(
        "Country ID must be a non-empty string.",
      );
    });
  });

  describe("getAddCountryConfig", () => {
    it("should return a valid AxiosRequestConfig object for adding a country", () => {
      const payload: CreateCountryDTO = {
        name: "Test Country",
        countryCode: "TC",
        withholdingTaxRate: 0.1,
      };
      const config = CountryAPI.getAddCountryConfig(payload);
      expect(config).toEqual({
        url: "/countries",
        method: "post",
        data: payload,
      });
    });
  });

  describe("getEditCountryConfig", () => {
    it("should return a valid AxiosRequestConfig object for editing a country", () => {
      const countryId = "123";
      const payload = { name: "Updated Country", iso2: "UC" };
      const config = CountryAPI.getEditCountryConfig(countryId, payload);
      expect(config).toEqual({
        url: "/countries/123",
        method: "put",
        data: payload,
      });
    });

    it("should throw an error if countryId is an empty string", () => {
      const payload = { name: "Updated Country", iso2: "UC" };
      expect(() => CountryAPI.getEditCountryConfig("", payload)).toThrow(
        "Country ID must be a non-empty string.",
      );
    });
  });

  describe("getDeleteCountryConfig", () => {
    it("should return a valid AxiosRequestConfig object for deleting a country", () => {
      const countryId = "123";
      const config = CountryAPI.getDeleteCountryConfig(countryId);
      expect(config).toEqual({
        url: "/countries/123",
        method: "delete",
      });
    });

    it("should throw an error if countryId is an empty string", () => {
      expect(() => CountryAPI.getDeleteCountryConfig("")).toThrow(
        "Country ID must be a non-empty string.",
      );
    });
  });
});
