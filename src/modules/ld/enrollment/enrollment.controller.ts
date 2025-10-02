import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";
import { AuthRequest } from "@/modules/iam/types/auth-request.type";

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery , ApiOperation } from "@nestjs/swagger";

import { ManageEnrollmentDto } from "./dto/manage-enrollment.dto";
import { EnrollmentService } from "./enrollment.service";

@Controller("enrollment")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @ApiOperation({ 
    summary: "Enroll in course", 
    description: "Enroll the current user in a course. Requires JWT authentication.",
    tags: ["Enrollment Management"]
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Query("courseId") courseId: string, @Req() req: AuthRequest) {
    // You may want to use courseId in your service call or logic
    return this.enrollmentService.enroll(req.user.sub, courseId);
  }

  @ApiOperation({ 
    summary: "Get all enrollments", 
    description: "Retrieve all enrollments with filtering options. Requires admin permissions.",
    tags: ["Enrollment Management"]
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ENROLLMENT_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
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

  @ApiOperation({ 
    summary: "Get my enrollment", 
    description: "Get the current user's enrollment for a specific course. Requires JWT authentication.",
    tags: ["Enrollment Management"]
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("my")
  getMyEnrollment(
    @Query("courseId") courseId: string,
    @Req() req: AuthRequest,
  ) {
    return this.enrollmentService.findByUserAndCourse(req.user.sub, courseId);
  }

  @ApiOperation({ 
    summary: "Get enrollment by ID", 
    description: "Retrieve a specific enrollment by its ID. Requires admin permissions.",
    tags: ["Enrollment Management"]
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ENROLLMENT_READ_ONE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @ApiOperation({ 
    summary: "Update enrollment", 
    description: "Update an enrollment status. Requires admin permissions.",
    tags: ["Enrollment Management"]
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ENROLLMENT_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(":id")
  manageEnrollment(
    @Param("id") id: string,
    @Body() manageEnrollmentDto: ManageEnrollmentDto,
  ) {
    return this.enrollmentService.update(+id, manageEnrollmentDto.status);
  }
}
