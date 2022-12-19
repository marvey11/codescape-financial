import { IsEnum, IsOptional, Length, MinLength } from "class-validator";

enum SecurityType {
  STOCK = "stock",
  EQUITY_FUND = "fund",
  ETF = "etf",
  CERTIFICATE = "certificate"
}

class CreateSecurityDTO {
  @Length(12, 12, { message: "ISIN must be exactly 12 characters long" })
  isin!: string;

  @MinLength(4, { message: "NSIN must be at least 4 characters long" })
  nsin!: string;

  @MinLength(3, { message: "Security Name must be at least 3 characters long" })
  name!: string;

  @MinLength(3, { message: "Security Short Name must be at least 3 characters long" })
  @IsOptional()
  shortName?: string;

  @IsEnum(SecurityType)
  type!: SecurityType;
}

export { CreateSecurityDTO, SecurityType };
