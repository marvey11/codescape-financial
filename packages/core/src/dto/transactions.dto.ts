import { IsDefined, IsEnum, IsISIN, IsISO8601, IsNumber } from "class-validator";

enum TransactionType {
  BUY = "buy",
  SELL = "sell"
}

class AddTransactionDTO {
  @IsDefined()
  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsDefined()
  @IsISIN()
  isin!: string;

  @IsDefined()
  @IsISO8601()
  date!: string;

  @IsDefined()
  @IsNumber()
  price!: number;

  @IsDefined()
  @IsNumber()
  shares!: number;
}

export { AddTransactionDTO, TransactionType };
