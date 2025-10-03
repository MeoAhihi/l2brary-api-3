import { Expose } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

export class ReferenceCourseDto {
  @Expose()
  @ApiProperty({ description: "Course ID" })
  id: number;

  @Expose()
  @ApiProperty({ description: "Course title" })
  title: string;

  @Expose()
  @ApiProperty({ description: "Course code" })
  code: string;
}
