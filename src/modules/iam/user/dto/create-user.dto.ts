import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
  Matches,
  IsEmail,
  MinLength,
} from "class-validator";
import { Gender } from "../entities/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
    example: "1990-01-01",
    description: "Birthdate of the user",
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthdate?: Date;

  @ApiProperty({
    example: "+1234567890",
    description: "Phone number of the user",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "phoneNumber must be a valid E.164 phone number",
  })
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
}
