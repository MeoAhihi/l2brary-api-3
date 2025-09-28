import { OmitType, PartialType } from "@nestjs/swagger";

import { CreateScoreColDto } from "./create-score-col.dto";

export class UpdateScoreColDto extends OmitType(
  PartialType(CreateScoreColDto),
  ["courseId"] as const,
) {}
