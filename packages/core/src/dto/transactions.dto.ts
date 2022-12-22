import { IsDateString, IsEnum, IsNumber, IsString, Length } from "class-validator";

enum TransactionType {
  BUY = "buy",
  SELL = "sell"
}

class AddTransactionDTO {
  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsString()
  @Length(12, 12, { message: "ISIN must be exactly 12 characters long" })
  isin!: string;

  @IsDateString()
  date!: Date;

  @IsNumber()
  price!: number;

  @IsNumber()
  shares!: number;
}

export { AddTransactionDTO, TransactionType };
