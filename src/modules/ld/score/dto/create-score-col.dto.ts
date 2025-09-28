import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateScoreColDto {
  @IsString()
  name: string;

  @IsInt()
  @IsOptional()
  coefficient?: number;
}
