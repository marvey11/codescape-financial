import { CountryEmbeddedDTO } from "./country.dto.js";

export class StockResponseDTO {
  id!: string;
  isin!: string;
  nsin!: string;
  name!: string;
  currency!: string;
  country!: CountryEmbeddedDTO;
}

export class CreateStockDTO {
  name!: string;
  isin!: string;
  nsin!: string;
  currency!: string;
  countryId!: string;
}

export class UpdateStockDTO {
  name!: string;
  isin!: string;
  nsin!: string;
  currency!: string;
  countryId!: string;
}
