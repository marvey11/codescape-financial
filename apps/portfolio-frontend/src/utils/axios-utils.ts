import { AxiosRequestConfig } from "axios";
import { RequestConfiguration } from "../types";
import { interpolatePath } from "./api-utils";

export const buildAxiosRequestConfig = (
  path: string,
  config: RequestConfiguration = {},
): AxiosRequestConfig => {
  const { params, queryParams } = config;

  const requestConfig: AxiosRequestConfig = {
    url: interpolatePath(path, params),
  };

  if (queryParams) {
    requestConfig.params = queryParams;
  }

  requestConfig.method = config.method ?? "get";

  if (config.data) {
    requestConfig.data = config.data;
  }

  return requestConfig;
};
