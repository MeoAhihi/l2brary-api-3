import { IsInt, IsString, IsUUID } from "class-validator";

export class CreateScoreColDto {
  @IsString()
  name: string;

  @IsInt()
  coefficient: number;
}
