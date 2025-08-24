import {
  CreateStockDTO,
  UpdateStockDTO,
} from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { RequestParamConfiguration } from "../types";
import { buildAxiosRequestConfig } from "../utils";

export class StockMetadataAPI {
  static getAllStocksConfig(countryId?: string): AxiosRequestConfig {
    const paramConfig: RequestParamConfiguration = {};
    if (typeof countryId === "string") {
      if (!countryId.trim()) {
        throw new Error("Country ID must be a non-empty string.");
      }
      paramConfig.queryParams = { countryId };
    }

    const config = buildAxiosRequestConfig(API_ENDPOINTS.STOCKS, paramConfig);
    return { ...config, method: "get" };
  }

  static getStockByIdConfig(stockId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.STOCK_BY_ID,
      stockId,
    );
    return { ...config, method: "get" };
  }

  static getAddStockConfig(payload: CreateStockDTO): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.STOCKS);
    return { ...config, method: "post", data: payload };
  }

  static getEditStockConfig(
    stockId: string,
    payload: UpdateStockDTO,
  ): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.STOCK_BY_ID,
      stockId,
    );
    return { ...config, method: "put", data: payload };
  }

  static getDeleteStockConfig(stockId: string): AxiosRequestConfig {
    const config = this.buildRequestConfigForId(
      API_ENDPOINTS.STOCK_BY_ID,
      stockId,
    );
    return { ...config, method: "delete" };
  }

  private static buildRequestConfigForId(
    route: string,
    stockId: string,
  ): AxiosRequestConfig {
    if (!stockId.trim()) {
      throw new Error("Stock ID must be a non-empty string.");
    }

    const paramConfig = { params: { id: stockId } };
    return buildAxiosRequestConfig(route, paramConfig);
  }
}
