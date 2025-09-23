import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ApiOperation, ApiQuery, ApiQueryOptions } from "@nestjs/swagger";
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
    name: "search",
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
  findAll(
    // Use @Query instead of @Param for optional query parameters
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string,
    @Query("group") group?: string,
    @Query("scheduleType")
    scheduleType?: ScheduleType,
  ) {
    return this.courseService.findAll({
      page,
      limit,
      search,
      group,
      scheduleType,
    });
  }

  @Get("groups")
  @ApiOperation({ summary: "Get unique course groups" })
  async getCourseGroups() {
    const groups = await this.courseService.findCourseGroup();
    return groups;
  }

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
