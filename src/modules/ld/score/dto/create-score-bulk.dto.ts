import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { IsInt, IsNumber } from "class-validator";

export class CreateScoreDto {
  @IsInt()
  userId: number;

  @IsNumber()
  score: number;
}

export class CreateScoreBulkDto {
  @IsInt()
  scoreColumnId: number;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScoreDto)
  scores: CreateScoreDto[];
}
