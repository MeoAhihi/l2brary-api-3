import { IsOptional } from "class-validator";

import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";

import { CreateScoreColDto } from "./create-score-col.dto";

export class UpdateScoreColDto extends PartialType(CreateScoreColDto) {
  @ApiPropertyOptional({ required: false, type: Boolean, example: false })
  @IsOptional()
  isLocked?: boolean;
}
