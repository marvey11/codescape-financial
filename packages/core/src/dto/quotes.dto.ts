import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsDefined,
  IsISIN,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested
} from "class-validator";

class QuoteDataItem {
  @IsDefined()
  @IsDateString()
  date!: Date;

  @IsDefined()
  @IsNumber()
  price!: number;
}

class AddQuoteDataDTO {
  @IsDefined()
  @IsISIN()
  isin!: string;

  @IsNotEmpty()
  @IsString()
  exchange!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  quotes!: QuoteDataItem[];
}

export { AddQuoteDataDTO, QuoteDataItem };
