import {
  CreateStockDTO,
  UpdateStockDTO,
} from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig, Method } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { RequestConfiguration } from "../types";
import { buildAxiosRequestConfig } from "../utils";

export class StockMetadataAPI {
  static getAllStocksConfig(countryId?: string): AxiosRequestConfig {
    const paramConfig: RequestConfiguration = {};
    if (typeof countryId === "string") {
      if (!countryId.trim()) {
        throw new Error("Country ID must be a non-empty string.");
      }
      paramConfig.queryParams = { countryId };
    }

    const config = buildAxiosRequestConfig(API_ENDPOINTS.STOCKS, paramConfig);
    return config;
  }

  static getStockByIdConfig(stockId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.STOCK_BY_ID,
      stockId,
    );
    return config;
  }

  static getAddStockConfig(payload: CreateStockDTO): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.STOCKS, {
      method: "post",
      data: payload,
    });
    return config;
  }

  static getEditStockConfig(
    stockId: string,
    payload: UpdateStockDTO,
  ): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.STOCK_BY_ID,
      stockId,
      "put",
      payload,
    );
    return config;
  }

  static getDeleteStockConfig(stockId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.STOCK_BY_ID,
      stockId,
      "delete",
    );
    return config;
  }

  private static buildRequestConfigForId(
    route: string,
    stockId: string,
    method: Method = "get",
    data?: unknown,
  ): AxiosRequestConfig {
    if (!stockId.trim()) {
      throw new Error("Stock ID must be a non-empty string.");
    }

    const paramConfig = { params: { id: stockId }, method, data };
    return buildAxiosRequestConfig(route, paramConfig);
  }
}
