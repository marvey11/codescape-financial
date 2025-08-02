import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

class CountryEmbeddedDTO {
  id!: string;
  name!: string;
  countryCode!: string;
}

class CountryResponseDTO {
  id!: string;
  name!: string;
  countryCode!: string;
  withholdingTaxRate!: number;
}

class CreateCountryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  countryCode!: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  withholdingTaxRate!: number;
}

class UpdateCountryDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  countryCode?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  withholdingTaxRate?: number;
}

export {
  CountryEmbeddedDTO,
  CountryResponseDTO,
  CreateCountryDTO,
  UpdateCountryDTO,
};
