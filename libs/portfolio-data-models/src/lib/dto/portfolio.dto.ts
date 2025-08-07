import { IsOptional, IsString, Length } from "class-validator";
import { PortfolioHoldingEmbeddedDTO } from "./portfolio-holding.dto.js";

export class CreatePortfolioDTO {
  @IsString()
  @Length(1, 31)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}

export class UpdatePortfolioDTO {
  @IsOptional()
  @IsString()
  @Length(1, 31)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}

export interface PortfolioResponseDTO {
  id: string;
  name: string;
  description?: string | undefined;
  summary: {
    totalCostBasis?: number;
    totalFees?: number;
    totalRealizedGains?: number;
    totalTaxFromSoldShares?: number;
    totalDividends?: number;
    totalTaxFromDividends?: number;
  };
  holdings: PortfolioHoldingEmbeddedDTO[];
}
