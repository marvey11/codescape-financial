import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";
import { CountryEmbeddedDTO } from "./country.dto.js";

export interface StockResponseDTO {
  id: string;
  isin: string;
  nsin: string;
  name: string;
  country: CountryEmbeddedDTO;
  currency: string;
}

export class CreateStockDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  isin!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nsin!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency!: string;

  @IsUUID()
  countryId!: string;
}

export class UpdateStockDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  isin?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nsin?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsUUID()
  countryId?: string;
}

export class StockMetadataFilterDTO {
  @IsOptional()
  @IsUUID()
  countryId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency?: string;
}

export interface StockEmbeddedDTO {
  id: string;
  isin: string;
  nsin: string;
  name: string;
}
