import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

import { ManageEnrollmentDto } from "./dto/manage-enrollment.dto";
import { EnrollmentService } from "./enrollment.service";

@Controller("enrollment")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  create(@Query("courseId") courseId: string, @Query("userId") userId: string) {
    // You may want to use courseId in your service call or logic
    return this.enrollmentService.enroll(userId, courseId);
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
    name: "courseId",
    required: false,
    type: String,
    description: "Filter by course ID",
  })
  findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("courseId") courseId?: string,
  ) {
    return this.enrollmentService.findAll({
      page,
      limit,
      courseId,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @Patch(":id")
  manageEnrollment(
    @Param("id") id: string,
    @Body() manageEnrollmentDto: ManageEnrollmentDto,
  ) {
    return this.enrollmentService.update(+id, manageEnrollmentDto.status);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.enrollmentService.remove(+id);
  }
}
