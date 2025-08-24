import { LatestQuotesRequestDTO } from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { buildAxiosRequestConfig } from "../utils";

export class HistoricalQuoteAPI {
  static getAllQuotesConfig(): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.QUOTES);
    return { ...config, method: "get" };
  }

  // TODO: create DTO for adding quotes
  static getAddHistoricalQuoteConfig(payload: unknown): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.QUOTES);
    return { ...config, method: "post", data: payload };
  }

  static getHistoricalQuoteByIdConfig(quoteId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.QUOTE_BY_ID,
      quoteId,
    );
    return { ...config, method: "get" };
  }

  // TODO: create DTO for editing quotes
  static getUpdateHistoricalQuoteConfig(
    quoteId: string,
    payload: unknown,
  ): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.QUOTE_BY_ID,
      quoteId,
    );
    return { ...config, method: "put", data: payload };
  }

  static getDeleteHistoricalQuoteConfig(quoteId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.QUOTE_BY_ID,
      quoteId,
    );
    return { ...config, method: "delete" };
  }

  static getLatestQuoteByISINConfig(isin: string): AxiosRequestConfig {
    if (!isin.trim()) {
      throw new Error("ISIN must be a non-empty string.");
    }

    const paramConfig = { params: { isin } };
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.LATEST_QUOTE_BY_ISIN,
      paramConfig,
    );
    return { ...config, method: "get" };
  }

  static getLatestQuotesBatchConfig(
    payload: LatestQuotesRequestDTO,
  ): AxiosRequestConfig {
    if (!payload.isins || payload.isins.length === 0) {
      throw new Error("ISIN array must not be empty.");
    }

    if (payload.isins.some((isin) => !isin.trim())) {
      throw new Error("ISIN array must not contain empty strings.");
    }

    const config = buildAxiosRequestConfig(API_ENDPOINTS.LATEST_QUOTES_BATCH);
    return { ...config, method: "post", data: payload };
  }

  private static buildRequestConfigForId(
    route: string,
    quoteId: string,
  ): AxiosRequestConfig {
    if (!quoteId.trim()) {
      throw new Error("Historical quote ID must be a non-empty string.");
    }

    const paramConfig = { params: { id: quoteId } };
    return buildAxiosRequestConfig(route, paramConfig);
  }
}
