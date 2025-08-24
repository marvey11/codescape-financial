import { AxiosRequestConfig } from "axios";
import { RequestParamConfiguration } from "../types";
import { interpolatePath } from "./api-utils";

export const buildAxiosRequestConfig = (
  path: string,
  config: RequestParamConfiguration = {},
): AxiosRequestConfig => {
  const { params, queryParams } = config;

  const requestConfig: AxiosRequestConfig = {
    url: interpolatePath(path, params),
  };

  if (queryParams) {
    requestConfig.params = queryParams;
  }

  return requestConfig;
};
