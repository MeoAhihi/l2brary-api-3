import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  IsEnum,
  ValidateNested,
  Matches,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import { ScheduleType, ScheduleDetail, Weekday } from "../types/schedule.types";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in the format YYYY-MM-DD",
  })
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
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in the format YYYY-MM-DD",
  })
  startDate: string;

  @ApiPropertyOptional({
    description: "Course end date",
    type: String,
    format: "date",
    example: "2024-08-01",
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in the format YYYY-MM-DD",
  })
  endDate?: string;

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
