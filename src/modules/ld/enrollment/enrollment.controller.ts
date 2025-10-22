import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";
import { AuthRequest } from "@/modules/iam/types/auth-request.type";
import { plainToInstance } from "class-transformer";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

import { ManageEnrollmentDto } from "./dto/manage-enrollment.dto";
import { EnrollmentService } from "./enrollment.service";
import { Enrollment } from "./entities/enrollment.entity";

@Controller("enrollment")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @ApiOperation({
    summary: "Enroll in course",
    description:
      "Enroll the current user in a course. Requires JWT authentication.",
    tags: ["Enrollment Management"],
  })
  @ApiForbiddenResponse({
    example: {
      message: "Course is not open for enrollment",
      error: "Forbidden",
      statusCode: 403,
    },
  })
  @ApiCreatedResponse({
    example: {
      id: 10,
      user: {
        id: "367276c4-f513-4331-86fe-be31f488960c",
        fullName: "Johny Doe",
        internationalName: "J. Doe",
      },
      course: {
        id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
        title: "Introduction to Programming",
        code: "CS101",
      },
      status: "pending",
      enrolledAt: "2025-10-11T05:47:18.717Z",
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Query("courseId") courseId: string, @Req() req: AuthRequest) {
    const enrollment = await this.enrollmentService.enroll(
      req.user.sub,
      courseId,
    );
    return plainToInstance(Enrollment, enrollment, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Get all enrollments",
    description:
      "Retrieve all enrollments with filtering options. Requires admin permissions.",
    tags: ["Enrollment Management"],
  })
  @ApiOkResponse({
    example: {
      items: [
        {
          id: 10,
          user: {
            id: "367276c4-f513-4331-86fe-be31f488960c",
            fullName: "Johny Doe",
            internationalName: "J. Doe",
          },
          course: {
            id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
            title: "Introduction to Programming",
            code: "CS101",
          },
          status: "pending",
          enrolledAt: "2025-10-11T05:47:18.717Z",
        },
      ],
      total: 6,
      page: 1,
      limit: 10,
      pageCount: 1,
    },
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
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("courseId") courseId?: string,
  ) {
    const result = await this.enrollmentService.findAll({
      page,
      limit,
      courseId,
    });
    result.items = plainToInstance(Enrollment, result.items, {
      excludeExtraneousValues: true,
    });
    return result;
  }

  @ApiOperation({
    summary: "Get my enrollment",
    description:
      "Get the current user's enrollment for a specific course. Requires JWT authentication.",
    tags: ["Enrollment Management"],
  })
  @ApiQuery({
    name: "courseId",
    required: false,
    type: String,
    description: "Course ID to find my enrollment for",
  })
  @ApiOkResponse({
    example: {
      message: "Enrollment found",
      enrollment: {
        id: 10,
        user: {
          id: "367276c4-f513-4331-86fe-be31f488960c",
          fullName: "Johny Doe",
          internationalName: "J. Doe",
        },
        course: {
          id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
          title: "Introduction to Programming",
          code: "CS101",
        },
        status: "pending",
        enrolledAt: "2025-10-11T05:47:18.717Z",
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("my")
  async getMyEnrollment(
    @Req() req: AuthRequest,
    @Query("courseId") courseId?: string,
  ) {
    const data = await this.enrollmentService.findByUserAndCourse(
      req.user.sub,
      courseId,
    );
    if (data.enrollment)
      data.enrollment = plainToInstance(Enrollment, data.enrollment, {
        excludeExtraneousValues: true,
      });
    return data;
  }

  @ApiOperation({
    summary: "Get enrollment by ID",
    description:
      "Retrieve a specific enrollment by its ID. Requires admin permissions.",
    tags: ["Enrollment Management"],
  })
  @ApiOkResponse({
    example: {
      message: "Enrollment found",
      enrollment: {
        id: 10,
        user: {
          id: "367276c4-f513-4331-86fe-be31f488960c",
          fullName: "Johny Doe",
          internationalName: "J. Doe",
        },
        course: {
          id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
          title: "Introduction to Programming",
          code: "CS101",
        },
        status: "pending",
        enrolledAt: "2025-10-11T05:47:18.717Z",
      },
    },
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ENROLLMENT_READ_ONE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const enrollment = await this.enrollmentService.findOne(+id);
    return plainToInstance(Enrollment, enrollment, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Update enrollment",
    description: "Update an enrollment status. Requires admin permissions.",
    tags: ["Enrollment Management"],
  })
  @ApiOkResponse({
    example: {
      message: "Enrollment found",
      enrollment: {
        id: 10,
        user: {
          id: "367276c4-f513-4331-86fe-be31f488960c",
          fullName: "Johny Doe",
          internationalName: "J. Doe",
        },
        course: {
          id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
          title: "Introduction to Programming",
          code: "CS101",
        },
        status: "pending",
        enrolledAt: "2025-10-11T05:47:18.717Z",
      },
    },
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ENROLLMENT_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(":id")
  async manageEnrollment(
    @Param("id") id: string,
    @Body() manageEnrollmentDto: ManageEnrollmentDto,
  ) {
    const enrollment = await this.enrollmentService.update(
      +id,
      manageEnrollmentDto.status,
    );
    return plainToInstance(Enrollment, enrollment, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Remove enrollment",
    description: "Delete an enrollment by its ID. Requires admin permissions.",
    tags: ["Enrollment Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ENROLLMENT_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(":id")
  async deleteEnrollment(@Param("id") id: string) {
    const result = await this.enrollmentService.remove(+id);
    return result;
  }

  @ApiOperation({
    summary: "Get student roster for a course",
    description:
      "Retrieve a roster of students enrolled (approved) in a course. Requires admin permissions.",
    tags: ["Enrollment Management"],
  })
  @ApiOkResponse({
    description: "List of enrolled students for the course.",
    example: [
      {
        id: 20,
        user: {
          id: "367276c4-f513-4331-86fe-be31f488960c",
          fullName: "Johny Doe",
          internationalName: "J. Doe",
        },
        status: "approved",
        enrolledAt: "2025-10-11T05:47:18.717Z",
      },
      {
        id: 21,
        user: {
          id: "4281e3c2-8ae6-47bb-b192-ff4d3a935169",
          fullName: "Jane Smith",
          internationalName: "J. Smith",
        },
        status: "approved",
        enrolledAt: "2025-10-11T08:11:18.717Z",
      },
    ],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ENROLLMENT_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get("course/:courseId/roster")
  async getStudentRoster(@Param("courseId") courseId: string) {
    const roster = await this.enrollmentService.getStudentRoster(courseId);
    // Optionally transform output for serialization
    return roster.map((enrollment) =>
      plainToInstance(Enrollment, enrollment, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
