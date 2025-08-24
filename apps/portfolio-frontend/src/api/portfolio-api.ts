import { PortfolioViewType } from "@codescape-financial/core";
import {
  CreatePortfolioDTO,
  UpdatePortfolioDTO,
} from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig, Method } from "axios";
import { API_ENDPOINTS } from "../config/api-endpoints";
import { RequestConfiguration } from "../types";
import { buildAxiosRequestConfig } from "../utils";

export class PortfolioAPI {
  static getAllPortfoliosConfig(): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.PORTFOLIOS);
    return config;
  }

  static getPortfolioByIdConfig(portfolioId: string): AxiosRequestConfig {
    const config = PortfolioAPI.buildRequestConfigForId(
      API_ENDPOINTS.PORTFOLIO_BY_ID,
      portfolioId,
    );
    return config;
  }

  static getAddPortfolioConfig(
    payload: CreatePortfolioDTO,
  ): AxiosRequestConfig {
    const config = buildAxiosRequestConfig(API_ENDPOINTS.PORTFOLIOS, {
      method: "post",
      data: payload,
    });
    return config;
  }

  static getEditPortfolioConfig(
    portfolioId: string,
    payload: UpdatePortfolioDTO,
  ): AxiosRequestConfig {
    const config = PortfolioAPI.buildRequestConfigForId(
      API_ENDPOINTS.PORTFOLIO_BY_ID,
      portfolioId,
      "put",
      payload,
    );
    return config;
  }

  static getDeletePortfolioConfig(portfolioId: string): AxiosRequestConfig {
    const config = PortfolioAPI.buildRequestConfigForId(
      API_ENDPOINTS.PORTFOLIO_BY_ID,
      portfolioId,
      "delete",
    );
    return config;
  }

  static getPortfolioXirrConfig(
    portfolioId: string,
    viewType?: PortfolioViewType,
  ): AxiosRequestConfig {
    const paramConfig = this.buildRequestParamConfigForId(portfolioId);
    if (viewType) {
      paramConfig.queryParams = { viewType };
    }

    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_XIRR,
      paramConfig,
    );

    return config;
  }

  static getPortfolioAllocationsConfig(
    portfolioId: string,
  ): AxiosRequestConfig {
    const paramConfig = PortfolioAPI.buildRequestParamConfigForId(portfolioId);
    const config = buildAxiosRequestConfig(
      API_ENDPOINTS.PORTFOLIO_ALLOCATIONS,
      paramConfig,
    );
    return config;
  }

  private static buildRequestParamConfigForId(
    portfolioId: string,
  ): RequestConfiguration {
    if (!portfolioId.trim()) {
      throw new Error("Portfolio ID must be a non-empty string.");
    }
    return { params: { id: portfolioId } };
  }

  private static buildRequestConfigForId(
    route: string,
    portfolioId: string,
    method: Method = "get",
    data?: unknown,
  ): AxiosRequestConfig {
    const paramConfig = PortfolioAPI.buildRequestParamConfigForId(portfolioId);
    return buildAxiosRequestConfig(route, { ...paramConfig, method, data });
  }
}
