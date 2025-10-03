import { Type } from "class-transformer";
import { IsInt, IsPositive, IsUUID, Min } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class PlusScoreDto {
  @ApiProperty({ description: "ID of the score column", example: 1 })
  @IsInt()
  @IsPositive()
  scoreColumnId: number;

  @ApiProperty({ description: "Score to add for this column", example: 10 })
  @IsInt()
  score: number;
}

export class CreateGameLogDto {
  @ApiProperty({
    description: "ID of the user",
    example: "b3e1c2d4-5678-4f9a-8b2c-123456789abc",
  })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: "Score achieved by the user", example: 100 })
  @IsInt()
  @Min(0)
  score: number;

  @ApiProperty({ description: "Time played in seconds", example: 300 })
  @IsInt()
  @Min(0)
  timePlayed: number;

  @ApiProperty({
    description: "Number of times the game was tried",
    example: 2,
  })
  @IsInt()
  @Min(1)
  triedTimes: number;

  @ApiProperty({
    description: "List of additional (plus) scores for specific columns",
    type: PlusScoreDto,
    isArray: true,
    required: false,
    example: [
      { scoreColumnId: 1, score: 10 },
      { scoreColumnId: 2, score: 5 },
    ],
  })
  @Type(() => PlusScoreDto)
  plusScores?: PlusScoreDto[];
}
