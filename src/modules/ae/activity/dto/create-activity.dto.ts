import { IsInt, IsString, Min } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateActivityDto {
  @ApiProperty({ description: "Name of the activity", example: "Quiz" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Point value for the activity", example: 10 })
  @IsInt()
  @Min(0)
  point: number;

  @ApiProperty({
    description: "Category of the activity",
    example: "Assessment",
  })
  @IsString()
  category: string;
}
