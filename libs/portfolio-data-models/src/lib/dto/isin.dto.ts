import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class BatchISINRequestDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  isins!: string[];
}
