import { MinLength } from "class-validator";

class AddExchangeDTO {
  @MinLength(4, { message: "Exchange name must be at least 4 characters long" })
  name!: string;
}

export { AddExchangeDTO };
