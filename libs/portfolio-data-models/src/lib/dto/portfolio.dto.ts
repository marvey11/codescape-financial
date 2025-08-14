import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { PortfolioHoldingEmbeddedDTO } from "./portfolio-holding.dto";

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

export class PortfolioViewFilterDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    // Check if the string value is explicitly 'true' or 'false'
    if (value === "true") return true;
    if (value === "false") return false;
    // For any other value (e.g., undefined, null, or other strings),
    // let IsBoolean validate or return the original value for IsOptional
    return value;
  })
  activeOnly?: boolean;
}
