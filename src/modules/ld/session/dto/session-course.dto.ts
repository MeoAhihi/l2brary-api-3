import { Expose } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

export class SessionCourseDto {
  @Expose()
  @ApiProperty({
    description: "Unique identifier of the course",
    example: "123",
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "Title of the course",
    example: "Introduction to Algebra",
    type: String,
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: "Course code",
    example: "ALG101",
    type: String,
  })
  code: string;

  @Expose()
  @ApiProperty({
    description: "Description of the course",
    example: "This course covers the basics of algebra.",
    type: String,
  })
  description: string;

  
}
