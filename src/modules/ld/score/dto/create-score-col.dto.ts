import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateScoreColDto {
  @ApiProperty({
    description: "Name of the score column",
    example: "Quiz 1",
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: "Coefficient for the score column (optional)",
    example: 2,
  })
  @IsInt()
  @IsOptional()
  coefficient?: number;
}
