import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { IsInt, IsNumber } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ScoreDto {
  @IsInt()
  @ApiProperty({ type: Number, description: "ID of the user" })
  userId: string;

  @IsNumber()
  @ApiProperty({ type: Number, description: "Score value" })
  score: number;
}