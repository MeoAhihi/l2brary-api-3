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

@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @ApiOperation({ summary: "Get and manage courses for admin" })
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

  /* Intentional No Guard */
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

  /* Intentional No Guard */
  @Get("groups")
  @ApiOperation({ summary: "Get unique course groups" })
  async getCourseGroups() {
    const groups = await this.courseService.findCourseGroup();
    return groups;
  }

  /* Intentional No Guard */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.courseService.findOne(id);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.courseService.remove(id);
  }
}
