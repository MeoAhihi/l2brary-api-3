import { IsString, IsOptional, IsDate } from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSessionDto {
  @ApiPropertyOptional({
    description: "Thumbnail URL for the session",
    type: String,
    example: "https://example.com/thumbnail.jpg",
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: "Title of the session",
    type: String,
    example: "Introduction to Algebra",
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: "Start time of the session (ISO 8601 string)",
    type: String,
    format: "date-time",
    example: "2024-06-01T10:00:00.000Z",
  })
  @IsOptional()
  @IsDate()
  startTime?: Date;

  @ApiPropertyOptional({
    description: "End time of the session (ISO 8601 string)",
    type: String,
    format: "date-time",
    example: "2024-06-01T12:00:00.000Z",
  })
  @IsOptional()
  @IsDate()
  endTime?: Date;

  @ApiPropertyOptional({
    description: "Name of the presenter",
    type: String,
    example: "Dr. Jane Doe",
  })
  @IsOptional()
  @IsString()
  presenterName?: string;
}
