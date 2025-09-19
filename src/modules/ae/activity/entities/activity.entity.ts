import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, Min } from "class-validator";

export class Activity {
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
