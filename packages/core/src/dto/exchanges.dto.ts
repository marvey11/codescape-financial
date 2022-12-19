import { MinLength } from "class-validator";

class CreateExchangeDTO {
  @MinLength(4, { message: "Exchange name must be at least 4 characters long" })
  name!: string;
}

export type { CreateExchangeDTO };
