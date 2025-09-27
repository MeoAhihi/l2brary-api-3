import { Transform } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { IsDateFormat } from "src/common/datetime.utils";
import { removePhoneHeadCode } from "src/common/phone-number.utils";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Gender } from "../../types/gender.enum";

export class CreateUserDto {
  @ApiProperty({ example: "John Doe", description: "Full name of the user" })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    example: "J. Doe",
    description: "International name of the user",
  })
  @IsOptional()
  @IsString()
  internationalName?: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: "Gender of the user",
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({
    type: String,
    format: "date",
    example: "2000-01-01",
    description: "Birthdate of the user (format: YYYY-MM-DD)",
  })
  @IsOptional()
  @IsString()
  @IsDateFormat()
  birthdate?: string;

  @ApiProperty({
    example: "+84123456789",
    description:
      "Phone number of the user. Accepts both E.164 format (e.g. +84123456789) and Vietnamese local format (e.g. 0123456789)",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+84\d{9}|0\d{9})$/, {
    message:
      "phoneNumber must be a valid Vietnamese phone number in either +84XXXXXXXXX or 0XXXXXXXXX format",
  })
  @Transform(({ value }) => removePhoneHeadCode(value))
  phoneNumber: string;

  @ApiPropertyOptional({
    example: "john.doe@example.com",
    description: "Email address of the user",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: "strongPassword123",
    description: "Password for the user account",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    type: [String],
    example: ["course-cert-1", "course-cert-2"],
    description: "List of course certificate IDs associated with the user",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  courseCertificates?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ["event-cert-1", "event-cert-2"],
    description: "List of event certificate IDs associated with the user",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventCertificates?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ["Intern at Company A", "Volunteer at Event B"],
    description: "List of experiences of the user",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  experiences?: string[];

  @ApiPropertyOptional({
    example: "Junior",
    description: "Rank or position of the user",
  })
  @IsOptional()
  @IsString()
  rank?: string;
}
