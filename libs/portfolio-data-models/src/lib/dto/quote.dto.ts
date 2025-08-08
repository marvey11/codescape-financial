import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class LatestQuotesRequestDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  isins!: string[];
}

/**
 * The latest quote response as sent from the backend.
 */
export interface LatestQuoteResponseDTO {
  isin: string;
  date: string;
  price: number;
}

/**
 * The latest quote DTO to be used in the frontend after the automatic axios date string transformation.
 */
export interface LatestQuoteTransformedDTO {
  isin: string;
  date: Date;
  price: number;
}

/**
 * The DTO for latest quote batches as sent from the backend.
 */
export interface AllLatestQuotesResponseDTO {
  [isin: string]: {
    date: string;
    price: number;
  };
}

/**
 * The DTO for latest quote batches to be used in the frontend after the automatic axios date string transformation.
 */
export interface AllLatestQuotesTransformedDTO {
  [isin: string]: {
    date: Date;
    price: number;
  };
}
