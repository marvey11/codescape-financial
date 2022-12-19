import { ArrayNotEmpty, IsArray, IsDateString, IsNumber, Length, MinLength, ValidateNested } from "class-validator";

class QuoteDataItem {
  @IsDateString()
  date!: Date;

  @IsNumber()
  price!: number;
}

class AddQuoteDataDTO {
  @Length(12, 12, { message: "ISIN must be exactly 12 characters long" })
  isin!: string;

  @MinLength(4, { message: "Exchange name must be at least 4 characters long" })
  exchange!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  quotes!: QuoteDataItem[];
}

export { AddQuoteDataDTO, QuoteDataItem };
