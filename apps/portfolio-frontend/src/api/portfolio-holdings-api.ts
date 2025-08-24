import { PortfolioViewType } from "@codescape-financial/core";
import { AxiosRequestConfig, Method } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { RequestConfiguration } from "../types";
import { buildAxiosRequestConfig } from "../utils";

export class PortfolioHoldingAPI {
  static getHoldingsByPortfolioConfig(portfolioId: string): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.PORTFOLIO_HOLDINGS, {
      params: { portfolioId },
    });
    return config;
  }

  static getHoldingListXIRRConfig(
    portfolioId: string,
    viewType?: PortfolioViewType,
  ): AxiosRequestConfig {
    const paramConfig: RequestConfiguration = {
      params: { portfolioId },
    };
    if (viewType) {
      paramConfig.queryParams = { viewType };
    }

    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_HOLDING_BATCH_XIRR,
      paramConfig,
    );

    return config;
  }

  static getOneHoldingConfig(
    portfolioId: string,
    holdingId: string,
  ): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_HOLDING_BY_ID,
      { params: { portfolioId, holdingId } },
    );
    return config;
  }

  static getOneHoldingXIRRConfig(
    portfolioId: string,
    holdingId: string,
    method: Method = "get",
    data?: unknown,
  ): AxiosRequestConfig {
    const paramConfig = { params: { portfolioId, holdingId }, method, data };
    return buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_HOLDING_XIRR,
      paramConfig,
    );
  }
}
