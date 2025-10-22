import { Expose } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

export class ReferenceUserDto {
  @Expose()
  @ApiProperty({ description: "User ID" })
  id: number;

  @Expose()
  @ApiProperty({ description: "User name" })
  fullName: string;

  @Expose()
  @ApiProperty({ description: "User international name" })
  internationalName: string;

  @Expose()
  @ApiProperty({
    description: "Avatar URL of the user",
    type: String,
    required: false,
  })
  avatarUrl?: string;
}
