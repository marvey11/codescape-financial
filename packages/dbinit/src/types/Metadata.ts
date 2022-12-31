import { SecurityType } from "@csfin/core";

export interface Metadata {
  isin: string;
  nsin: string;
  name: string;
  "short-name"?: string;
  type: SecurityType;
}
