import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ReferenceCourseDto } from "../../course/dto/reference-course.dto";
import { Course } from "../../course/entities/course.entity";

export class ReferenceSessionDto {
  @Expose()
  @ApiProperty({ description: "Session ID" })
  id: number;

  @Expose()
  @ApiProperty({ description: "Session thumbnail URL", required: false })
  thumbnail?: string;

  @Expose()
  @ApiProperty({ description: "Session title" })
  title: string;

  @Expose()
  @Type(() => ReferenceCourseDto)
  @ApiProperty({ type: () => ReferenceCourseDto, description: "Related course" })
  course: Course;
}
