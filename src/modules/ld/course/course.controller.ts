import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiQueryOptions,
} from "@nestjs/swagger";

import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ScheduleType } from "./types/schedule.types";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({
    summary: "Create course",
    description: "Create a new course. Requires admin permissions.",
    tags: ["Course Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @ApiOperation({
    summary: "Get all courses (admin)",
    description:
      "Retrieve all courses with filtering options. Requires admin permissions.",
    tags: ["Course Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
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
  @Get()
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

  @ApiOperation({
    summary: "Get public courses",
    description:
      "Retrieve public courses available to all users. No authentication required.",
    tags: ["Course Management"],
  })
  /* Intentional No Guard */
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
  @Get("public")
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

  @ApiOperation({
    summary: "Get course groups",
    description: "Retrieve unique course groups. No authentication required.",
    tags: ["Course Management"],
  })
  /* Intentional No Guard */
  @Get("groups")
  async getCourseGroups() {
    const groups = await this.courseService.findCourseGroup();
    return groups;
  }

  @ApiOperation({
    summary: "Get course by ID",
    description:
      "Retrieve a specific course by its ID. No authentication required.",
    tags: ["Course Management"],
  })
  /* Intentional No Guard */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.courseService.findOne(id);
  }

  @ApiOperation({
    summary: "Update course",
    description: "Update an existing course. Requires admin permissions.",
    tags: ["Course Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }
}
