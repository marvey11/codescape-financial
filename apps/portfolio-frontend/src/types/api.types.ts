import { Method } from "axios";

export interface RequestConfiguration {
  params?: Record<string, string | number>;
  queryParams?: Record<string, string>;
  method?: Method;
  data?: unknown;
}
