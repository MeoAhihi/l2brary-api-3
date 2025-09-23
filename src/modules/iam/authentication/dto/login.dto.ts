import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { removePhoneHeadCode } from "src/common/phone-number.utils";

import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
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

  @ApiProperty({
    example: "strongPassword123",
    description: "Password for the user account",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
