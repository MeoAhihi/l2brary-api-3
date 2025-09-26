import { Expose, Type } from "class-transformer";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Game } from "../../game/entities/game.entity";
import { LocationTypeEnum } from "../../types/location-type.enum";
import { Attendance } from "../entities/attendance.entity";

export class SessionDto {
  @Expose()
  @ApiProperty({ description: "Session ID" })
  id: number;

  @ApiPropertyOptional({ description: "Thumbnail URL" })
  thumbnail?: string;

  @ApiProperty({ description: "Session title" })
  title: string;

  @ApiPropertyOptional({ description: "Session description" })
  description?: string;

  @ApiProperty({
    description: "Session start time",
    type: String,
    format: "date-time",
  })
  startTime: Date;

  @ApiPropertyOptional({
    description: "Session end time",
    type: String,
    format: "date-time",
  })
  endTime?: Date;

  @ApiPropertyOptional({ description: "Presenter name" })
  presenterName?: string;

  @ApiPropertyOptional({ enum: LocationTypeEnum, description: "Location type" })
  locationType?: LocationTypeEnum;

  @ApiPropertyOptional({ description: "Room information" })
  roomInfo?: string;

  @ApiPropertyOptional({ description: "Address" })
  address?: string;

  @ApiPropertyOptional({ description: "Maximum number of participants" })
  maxParticipant?: number;

  @ApiPropertyOptional({ description: "Late threshold (minutes)" })
  lateThreshold?: number;

  @ApiPropertyOptional({ description: "Auto check-in enabled" })
  autoCheckIn?: boolean;

  @ApiPropertyOptional({ description: "Allow late join" })
  allowLateJoin?: boolean;

  @ApiPropertyOptional({ description: "Enable game" })
  enableGame?: boolean;

  @ApiPropertyOptional({ description: "Auto scoring enabled" })
  autoScoring?: boolean;

  @ApiPropertyOptional({ description: "Maximum games per session" })
  maxGamePerSession?: number;

  @ApiPropertyOptional({ description: "Game timeout (seconds)" })
  gameTimeout?: number;

  @ApiPropertyOptional({ description: "Email notification enabled" })
  emailNotification?: boolean;

  @ApiPropertyOptional({ description: "SMS notification enabled" })
  smsNotification?: boolean;

  @ApiPropertyOptional({ description: "Reminder notification enabled" })
  reminderNotification?: boolean;

  @Expose()
  @ApiProperty({
    description: "List of attendances for the session",
    type: () => Attendance,
    isArray: true,
    required: false,
  })
  @Type(() => Attendance)
  attendances?: Attendance[];

  @ApiProperty({
    description: "List of games for the session",
    type: () => Game,
    isArray: true,
    required: false,
  })
  games?: Game[];

  @ApiProperty({
    description: "Last updated at",
    type: String,
    format: "date-time",
  })
  updatedAt: Date;

  @ApiProperty({ description: "Session status" })
  status: string;

  @ApiProperty({ description: "Number of checked attendances" })
  checked: number;

  @ApiProperty({ description: "Total number of games" })
  totalGame: number;
}
