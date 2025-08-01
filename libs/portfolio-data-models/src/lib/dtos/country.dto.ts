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
  name!: string;
  countryCode!: string;
  withholdingTaxRate!: number;
}

class UpdateCountryDTO {
  name!: string;
  countryCode!: string;
  withholdingTaxRate!: number;
}

export {
  CountryEmbeddedDTO,
  CountryResponseDTO,
  CreateCountryDTO,
  UpdateCountryDTO,
};
