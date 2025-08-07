import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from "class-validator";

export class CreateBuyTransactionDTO {
  @IsUUID()
  portfolioId!: string;

  @IsUUID()
  stockId!: string;

  @IsDateString()
  date!: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  shares!: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  pricePerShare!: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  fees?: number = 0.0;
}

export class CreateSellTransactionDTO {
  @IsUUID()
  portfolioId!: string;

  @IsUUID()
  stockId!: string;

  @IsDateString()
  date!: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  shares!: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  pricePerShare!: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  fees?: number = 0.0;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  taxes?: number = 0.0;
}

export class CreateStockSplitDTO {
  @IsUUID()
  portfolioId!: string;

  @IsUUID()
  stockId!: string;

  @IsDateString()
  date!: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  splitRatio!: number;
}

export class CreateDividendDTO {
  @IsUUID()
  portfolioId!: string;

  @IsUUID()
  stockId!: string;

  @IsDateString()
  date!: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  dividendPerShare!: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  applicableShares!: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  exchangeRate?: number = 1.0;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  taxes?: number = 0.0;
}
