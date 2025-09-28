import { OmitType, PartialType } from "@nestjs/swagger";

import { CreateGameLogDto } from "./create-game-log.dto";

export class UpdateGameLogDto extends PartialType(
  OmitType(CreateGameLogDto, ["userId"] as const),
) {}
