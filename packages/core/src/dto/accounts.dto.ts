import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

class CreateAccountDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export { CreateAccountDTO };
