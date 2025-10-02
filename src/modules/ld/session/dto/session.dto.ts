import { Expose, Type } from "class-transformer";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Course } from "../../course/entities/course.entity";
import { Game } from "../../game/entities/game.entity";
import { LocationTypeEnum } from "../../types/location-type.enum";
import { Attendance } from "../entities/attendance.entity";
import { SessionCourseDto } from "./session-course.dto";

export class SessionDto {
  @Expose()
  @ApiProperty({ description: "Session ID" })
  id: number;

  @Expose()
  @ApiPropertyOptional({ description: "Thumbnail URL" })
  thumbnail?: string;

  @Expose()
  @ApiProperty({ description: "Session title" })
  title: string;

  @Expose()
  @ApiProperty({
    description: "Course",
    type: SessionCourseDto,
  })
  @Type(() => SessionCourseDto)
  course: Course;

  @Expose()
  @ApiPropertyOptional({ description: "Session description" })
  description?: string;

  @Expose()
  @ApiProperty({
    description: "Session start time",
    type: String,
    format: "date-time",
  })
  startTime: Date;

  @Expose()
  @ApiPropertyOptional({
    description: "Session end time",
    type: String,
    format: "date-time",
  })
  endTime?: Date;

  @Expose()
  @ApiPropertyOptional({ description: "Presenter name" })
  presenterName?: string;

  @Expose()
  @ApiPropertyOptional({ enum: LocationTypeEnum, description: "Location type" })
  locationType?: LocationTypeEnum;

  @Expose()
  @ApiPropertyOptional({ description: "Room information" })
  roomInfo?: string;

  @Expose()
  @ApiPropertyOptional({ description: "Address" })
  address?: string;

  @Expose()
  @ApiPropertyOptional({ description: "Maximum number of participants" })
  maxParticipant?: number;

  @Expose()
  @ApiPropertyOptional({ description: "Late threshold (minutes)" })
  lateThreshold?: number;

  @Expose()
  @ApiPropertyOptional({ description: "Auto check-in enabled" })
  autoCheckIn?: boolean;

  @Expose()
  @ApiPropertyOptional({ description: "Allow late join" })
  allowLateJoin?: boolean;

  @Expose()
  @ApiPropertyOptional({ description: "Enable game" })
  enableGame?: boolean;

  @Expose()
  @ApiPropertyOptional({ description: "Auto scoring enabled" })
  autoScoring?: boolean;

  @Expose()
  @ApiPropertyOptional({ description: "Maximum games per session" })
  maxGamePerSession?: number;

  @Expose()
  @ApiPropertyOptional({ description: "Game timeout (seconds)" })
  gameTimeout?: number;

  @Expose()
  @ApiPropertyOptional({ description: "Email notification enabled" })
  emailNotification?: boolean;

  @Expose()
  @ApiPropertyOptional({ description: "SMS notification enabled" })
  smsNotification?: boolean;

  @Expose()
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

  @Expose()
  @ApiProperty({
    description: "List of games for the session",
    type: () => Game,
    isArray: true,
    required: false,
  })
  games?: Game[];

  @Expose()
  @ApiProperty({
    description: "Last updated at",
    type: String,
    format: "date-time",
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ description: "Session status" })
  status: string;

  @Expose()
  @ApiProperty({ description: "Number of checked attendances" })
  checked: number;

  @Expose()
  @ApiProperty({ description: "Total number of games" })
  totalGame: number;
}
