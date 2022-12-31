import { IsDateString, IsDefined, IsEnum, IsISIN, IsNumber } from "class-validator";

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
  @IsDateString()
  date!: Date;

  @IsDefined()
  @IsNumber()
  price!: number;

  @IsDefined()
  @IsNumber()
  shares!: number;
}

export { AddTransactionDTO, TransactionType };
