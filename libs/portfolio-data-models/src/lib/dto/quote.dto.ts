import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export interface LatestQuoteResponseDTO {
  isin: string;
  date: Date;
  price: number;
}

export interface AllLatestQuotesResponseDTO {
  [isin: string]: {
    date: Date;
    price: number;
  };
}

export class LatestQuotesRequestDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  isins!: string[];
}
