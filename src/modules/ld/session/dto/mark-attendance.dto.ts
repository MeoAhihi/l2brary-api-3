import { IsArray, IsDateString, IsOptional, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class MarkAttendanceDto {
  @ApiProperty({
    description: "Array of user IDs to mark attendance for",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @ApiProperty({
    description: "Time of attendance (ISO 8601 string)",
    required: false,
    example: "2024-06-01T12:00:00.000Z",
  })
  @IsOptional()
  time?: Date;
}
