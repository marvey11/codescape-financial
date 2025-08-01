import { AxiosRequestConfig } from "axios";

interface UseGenericContextType<T> {
  loading: boolean;
  error: string;
  data: T | undefined;
  sendRequest: (config: AxiosRequestConfig) => Promise<void>;
}

export type { UseGenericContextType };
