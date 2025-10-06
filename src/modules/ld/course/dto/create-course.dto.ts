import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { IsDateFormat } from "src/common/datetime.utils";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { ScheduleDetail, ScheduleType, Weekday } from "../types/schedule.types";

export class CreateCourseDto {
  @ApiProperty({
    description: "Course title",
    example: "Introduction to Programming",
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: "Course code", example: "CS101" })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: "Course description",
    example: "Learn the basics of programming using Python.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Course difficulty",
    example: "Beginner",
  })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional({ description: "Is the course public?", example: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: "Does the course require approval?",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isRequireApproval?: boolean;

  @ApiPropertyOptional({
    description: "Is guest access allowed?",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isAllowGuestAccess?: boolean;

  @ApiPropertyOptional({
    description: "Course thumbnail URL",
    example: "https://example.com/thumbnail.jpg",
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: "Maximum number of students",
    example: 30,
  })
  @IsOptional()
  @IsInt()
  maxStudents?: number;

  @ApiPropertyOptional({
    description: "Enrollment deadline",
    type: String,
    format: "date",
    example: "2024-06-10",
  })
  @IsOptional()
  @IsDateFormat()
  enrollmentDeadlineDate?: string;

  @ApiProperty({ description: "Course group", example: "Computer Science" })
  @IsString()
  group: string;

  @ApiProperty({
    enum: ScheduleType,
    description: "Schedule type",
    example: ScheduleType.WEEKLY,
  })
  @IsEnum(ScheduleType)
  scheduleType: ScheduleType;

  @ApiProperty({
    description: "Course start date",
    type: String,
    format: "date",
    example: "2024-06-01",
  })
  @IsDateFormat()
  startDate: string;

  @ApiPropertyOptional({
    description: "Course end date",
    type: String,
    format: "date",
    example: "2024-08-01",
  })
  @IsOptional()
  @IsDateFormat()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Course start time (HH:mm:ss, 24-hour format)",
    type: String,
    format: "time",
    example: "09:00:00",
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    description: "Course end time (HH:mm:ss, 24-hour format)",
    type: String,
    format: "time",
    example: "11:00:00",
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({
    description: "Schedule detail (structure depends on scheduleType)",
    type: Object,
    example: {
      daysOfWeek: [Weekday.MONDAY, Weekday.WEDNESDAY],
      // dayOfMonth: 15,
      // dates: ["2024-06-01", "2024-06-15"],
    },
  })
  @IsObject()
  scheduleDetail: ScheduleDetail;

  @ApiPropertyOptional({
    description: "Chat group URL",
    example: "https://chat.example.com/group/123",
  })
  @IsOptional()
  @IsString()
  chatGroupUrl?: string;
}
