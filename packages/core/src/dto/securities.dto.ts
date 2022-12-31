import { IsDefined, IsEnum, IsISIN, IsOptional, IsString, Length, MinLength } from "class-validator";

enum SecurityType {
  STOCK = "stock",
  EQUITY_FUND = "fund",
  ETF = "etf",
  CERTIFICATE = "certificate"
}

class AddSecurityDTO {
  @IsDefined()
  @IsISIN()
  isin!: string;

  @IsDefined()
  @IsString()
  @Length(6, 6, { message: "NSIN (WKN) must be exactly 6 characters long" })
  nsin!: string;

  @IsDefined()
  @IsString()
  @MinLength(4, { message: "Security Name must be at least 4 characters long" })
  name!: string;

  @IsOptional()
  @MinLength(3, { message: "Security Short Name must be at least 3 characters long" })
  shortName?: string;

  @IsDefined()
  @IsEnum(SecurityType)
  type!: SecurityType;
}

export { AddSecurityDTO, SecurityType };
