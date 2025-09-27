import { IsNotEmpty, IsString, MinLength } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({
    example: "securePassword123",
    description: "Current password of the user",
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: "newStrongPassword456",
    description: "New password for the user account",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
