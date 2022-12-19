import { IsArray, IsDateString, IsNumber, Length, MinLength } from "class-validator";

class QuoteItem {
  @IsDateString()
  date!: Date;

  @IsNumber()
  price!: number;
}

class CreateQuotesDTO {
  @Length(12, 12, { message: "ISIN must be exactly 12 characters long" })
  isin!: string;

  @MinLength(4, { message: "Exchange name must be at least 4 characters long" })
  exchange!: string;

  @IsArray({ each: true })
  quotes!: QuoteItem[];
}

export { CreateQuotesDTO, QuoteItem };
