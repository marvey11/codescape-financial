import {
  CreateBuyTransactionDTO,
  CreateDividendDTO,
  CreateSellTransactionDTO,
  CreateStockSplitDTO,
} from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { buildAxiosRequestConfig } from "../utils";

export class PortfolioOperationsAPI {
  static getAllOperationsConfig(): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.PORTFOLIO_OPERATIONS);
    return { ...config, method: "get" };
  }

  static getBuyOperationConfig(
    payload: CreateBuyTransactionDTO,
  ): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_BUY_OPERATION,
    );
    return { ...config, method: "post", data: payload };
  }

  static getSellOperationConfig(
    payload: CreateSellTransactionDTO,
  ): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_SELL_OPERATION,
    );
    return { ...config, method: "post", data: payload };
  }

  static getStockSplitOperationConfig(
    payload: CreateStockSplitDTO,
  ): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_STOCK_SPLIT_OPERATION,
    );
    return { ...config, method: "post", data: payload };
  }

  static getDividendOperationConfig(
    payload: CreateDividendDTO,
  ): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_DIVIDEND_OPERATION,
    );
    return { ...config, method: "post", data: payload };
  }
}
