import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsDate, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class LogActivityDto {
  @ApiProperty({ description: "User identifier", example: "user123" })
  @IsString()
  userId: string;

  @ApiProperty({ description: "Activity performed", example: "login" })
  @IsInt()
  activityId: number;

  @ApiPropertyOptional({
    description: "Optional note about the activity",
    example: "Completed extra tasks",
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: "Date and time of activity",
    example: "2024-06-01T12:00:00Z",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;
}
