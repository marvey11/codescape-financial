import { PortfolioViewType } from "@codescape-financial/core";
import { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { RequestParamConfiguration } from "../types";
import { buildAxiosRequestConfig } from "../utils";

export class PortfolioHoldingAPI {
  static getHoldingsByPortfolioConfig(portfolioId: string): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.PORTFOLIO_HOLDINGS, {
      params: { portfolioId },
    });
    return { ...config, method: "get" };
  }

  static getHoldingListXIRRConfig(
    portfolioId: string,
    viewType?: PortfolioViewType,
  ): AxiosRequestConfig {
    const paramConfig: RequestParamConfiguration = {
      params: { portfolioId },
    };
    if (viewType) {
      paramConfig.queryParams = { viewType };
    }

    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_HOLDING_BATCH_XIRR,
      paramConfig,
    );

    return { ...config, method: "get" };
  }

  static getOneHoldingConfig(
    portfolioId: string,
    holdingId: string,
  ): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_HOLDING_BY_ID,
      { params: { portfolioId, holdingId } },
    );
    return { ...config, method: "get" };
  }

  static getOneHoldingXIRRConfig(
    portfolioId: string,
    holdingId: string,
  ): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_HOLDING_XIRR,
      { params: { portfolioId, holdingId } },
    );
    return { ...config, method: "get" };
  }
}
