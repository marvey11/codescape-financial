import {
  CreateCountryDTO,
  UpdateCountryDTO,
} from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig, Method } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { buildAxiosRequestConfig } from "../utils";

export class CountryAPI {
  static getAllCountriesConfig(): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.COUNTRIES);
    return config;
  }

  static getCountryByIdConfig(countryId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.COUNTRY_BY_ID,
      countryId,
    );
    return config;
  }

  static getAddCountryConfig(payload: CreateCountryDTO): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.COUNTRIES, {
      method: "post",
      data: payload,
    });
    return config;
  }

  static getEditCountryConfig(
    countryId: string,
    payload: UpdateCountryDTO,
  ): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.COUNTRY_BY_ID,
      countryId,
      "put",
      payload,
    );
    return config;
  }

  static getDeleteCountryConfig(countryId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.COUNTRY_BY_ID,
      countryId,
      "delete",
    );
    return config;
  }

  private static buildRequestConfigForId(
    route: string,
    countryId: string,
    method: Method = "get",
    data?: unknown,
  ): AxiosRequestConfig {
    if (!countryId.trim()) {
      throw new Error("Country ID must be a non-empty string.");
    }

    const paramConfig = { params: { id: countryId }, method, data };
    return buildAxiosRequestConfig(route, paramConfig);
  }
}
