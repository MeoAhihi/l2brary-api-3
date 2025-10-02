import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
  @ApiProperty({
    description: "The new name for the role",
    example: "admin",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "A description for the role",
    example: "Administrator role with full view permissions",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
