import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { LocationTypeEnum } from "../../types/location-type.enum";

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
    description: "Description of the session",
    type: String,
    example: "This session will cover the basics of algebra.",
  })
  @IsOptional()
  @IsString()
  description?: string;

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

  @ApiPropertyOptional({
    description: "Location type of the session (e.g., online, onsite, hybrid)",
    type: String,
    example: "online",
  })
  @IsOptional()
  @IsString()
  locationType?: LocationTypeEnum;

  @ApiPropertyOptional({
    description:
      "Room information for the session (e.g., room number, link, etc.)",
    type: String,
    example: "Room 101, Main Building",
  })
  @IsOptional()
  @IsString()
  roomInfo?: string;

  @ApiPropertyOptional({
    description: "Address of the session location (if applicable)",
    type: String,
    example: "123 Main St, Springfield",
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: "Maximum number of participants allowed in the session",
    type: Number,
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipant?: number;

  @ApiPropertyOptional({
    description:
      "Threshold in minutes after which a participant is considered late",
    type: Number,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  lateThreshold?: number;

  @ApiPropertyOptional({
    description: "Enable or disable auto check-in for the session",
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  autoCheckIn?: boolean;

  @ApiPropertyOptional({
    description: "Allow participants to join the session after it has started",
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  allowLateJoin?: boolean;

  @ApiPropertyOptional({
    description: "Enable or disable game for the session",
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enableGame?: boolean;

  @ApiPropertyOptional({
    description: "Enable or disable auto scoring for the session",
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  autoScoring?: boolean;

  @ApiPropertyOptional({
    description: "Maximum number of games allowed per session",
    type: Number,
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxGamePerSession?: number;
  @ApiPropertyOptional({
    description: "Game timeout in seconds for the session",
    type: Number,
    example: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  gameTimeout?: number;
  @ApiPropertyOptional({
    description: "Enable or disable email notification for the session",
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  emailNotification?: boolean;

  @ApiPropertyOptional({
    description: "Enable or disable SMS notification for the session",
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  smsNotification?: boolean;

  @ApiPropertyOptional({
    description: "Enable or disable reminder notification for the session",
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  reminderNotification?: boolean;
}
