import { IsNotEmpty, IsString } from "class-validator";

class AddExchangeDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

export { AddExchangeDTO };
