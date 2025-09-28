import { IsInt, IsPositive, Min } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateGameLogDto {
  @ApiProperty({ description: "ID of the user", example: 1 })
  @IsInt()
  @IsPositive()
  userId: number;

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
}
