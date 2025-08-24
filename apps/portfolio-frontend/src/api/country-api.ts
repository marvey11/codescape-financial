import {
  CreateCountryDTO,
  UpdateCountryDTO,
} from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { buildAxiosRequestConfig } from "../utils";

export class CountryAPI {
  static getAllCountriesConfig(): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.COUNTRIES);
    return { ...config, method: "get" };
  }

  static getCountryByIdConfig(countryId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.COUNTRY_BY_ID,
      countryId,
    );
    return { ...config, method: "get" };
  }

  static getAddCountryConfig(payload: CreateCountryDTO): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.COUNTRIES);
    return { ...config, method: "post", data: payload };
  }

  static getEditCountryConfig(
    countryId: string,
    payload: UpdateCountryDTO,
  ): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.COUNTRY_BY_ID,
      countryId,
    );
    return { ...config, method: "put", data: payload };
  }

  static getDeleteCountryConfig(countryId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.COUNTRY_BY_ID,
      countryId,
    );
    return { ...config, method: "delete" };
  }

  private static buildRequestConfigForId(
    route: string,
    countryId: string,
  ): AxiosRequestConfig {
    if (!countryId.trim()) {
      throw new Error("Country ID must be a non-empty string.");
    }

    const paramConfig = { params: { id: countryId } };
    return buildAxiosRequestConfig(route, paramConfig);
  }
}
