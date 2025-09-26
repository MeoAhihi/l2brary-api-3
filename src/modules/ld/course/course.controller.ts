import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiQueryOptions } from "@nestjs/swagger";

import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ScheduleType } from "./types/schedule.types";

@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page",
  })
  @ApiQuery({
    name: "title",
    required: false,
    type: String,
    description: "Search by course title",
  })
  @ApiQuery({
    name: "group",
    required: false,
    type: String,
    description: "Filter by group",
  })
  @ApiQuery({
    name: "scheduleType",
    required: false,
    enum: ScheduleType,
    description: "Filter by schedule type",
  })
  @ApiQuery({
    name: "isPublic",
    required: false,
    type: Boolean,
    description: "Filter by public courses",
  })
  // for authenticated user's course catalog
  findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("title") title?: string,
    @Query("group") group?: string,
    @Query("scheduleType") scheduleType?: ScheduleType,
    @Query("isPublic") isPublic?: string, // Note: query params are strings
  ) {
    // Convert isPublic to boolean if provided
    let isPublicBool: boolean | undefined = undefined;
    if (typeof isPublic === "string") {
      if (isPublic.toLowerCase() === "true") isPublicBool = true;
      else if (isPublic.toLowerCase() === "false") isPublicBool = false;
    }
    return this.courseService.findAll({
      page,
      limit,
      title,
      group,
      scheduleType,
      isPublic: isPublicBool,
    });
  }

  @Get("public")
  @ApiOperation({ summary: "Get public courses" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page",
  })
  @ApiQuery({
    name: "title",
    required: false,
    type: String,
    description: "Search by course title",
  })
  @ApiQuery({
    name: "group",
    required: false,
    type: String,
    description: "Filter by group",
  })
  @ApiQuery({
    name: "scheduleType",
    required: false,
    enum: ScheduleType,
    description: "Filter by schedule type",
  })
  // for guest to view catalog of courses
  findPublicCourses(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("title") title?: string,
    @Query("group") group?: string,
    @Query("scheduleType") scheduleType?: ScheduleType,
  ) {
    return this.courseService.findAll({
      page,
      limit,
      title,
      group,
      scheduleType,
      isPublic: true,
    });
  }

  @Get("groups")
  @ApiOperation({ summary: "Get unique course groups" })
  async getCourseGroups() {
    const groups = await this.courseService.findCourseGroup();
    return groups;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.courseService.remove(id);
  }
}
