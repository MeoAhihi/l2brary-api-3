import { Expose } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

export class AttendanceUserDto {
  @Expose()
  @ApiProperty({ description: "User ID" })
  id: number;

  @Expose()
  @ApiProperty({ description: "User name" })
  fullName: string;

  @Expose()
  @ApiProperty({ description: "User international name" })
  internationalName: string;
}
