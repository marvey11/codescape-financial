export interface AssetAllocationDTO {
  isin: string;
  name: string;
  value: number;
  percentage: number;
}

export interface CountryAllocationDTO {
  countryCode: string;
  name: string;
  value: number;
  percentage: number;
}

export interface AllocationResponseDTO {
  portfolioId: string;
  date: string;
  assetAllocation: AssetAllocationDTO[];
  countryAllocation: CountryAllocationDTO[];
}

export interface AllocationTransformedDTO {
  portfolioId: string;
  date: Date;
  assetAllocation: AssetAllocationDTO[];
  countryAllocation: CountryAllocationDTO[];
}
