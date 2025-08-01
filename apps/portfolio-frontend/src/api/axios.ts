import { transformDateStringsToDates } from "@codescape-financial/core";
import axios, { AxiosResponseTransformer } from "axios";

const BASE_URL = "/api";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  transformResponse: ([] as AxiosResponseTransformer[])
    .concat(axios.defaults.transformResponse ?? [])
    .concat(transformDateStringsToDates),
});

export default instance;
