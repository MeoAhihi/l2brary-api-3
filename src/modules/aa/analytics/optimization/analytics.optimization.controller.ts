import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

import { AnalyticsOptimizationService } from "./analytics.optimization.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("analytics/optimization")
export class AnalyticsOptimizationController {
  constructor(
    private readonly analyticsOptimizationService: AnalyticsOptimizationService,
  ) {}

  @ApiOperation({
    summary: "Get total enrollments by course",
    description:
      "Retrieve total enrollment counts for each course. Requires admin permissions.",
    tags: ["Analytics - Optimization"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.OPTIMIZATION_TOTAL_ENROLLMENTS)
  @Get("total-enrollments")
  // SWAGGER: Response is object where key=courseId, value=number of enrollments
  @ApiOperation({
    summary: "Get total enrollments by course",
    description:
      "Returns enrollment count per course as an object: { [courseId]: count }",
    tags: ["Analytics - Optimization"],
  })
  @ApiBearerAuth()
  // Add openapi response
  @ApiResponse({
    status: 200,
    description: "Enrollment counts for each course",
    example: [
      {
        courseTitle: "Lớp Đàn Chủ",
        courseCode: "DC101",
        courseId: "7b7970ed-11e6-4fd2-8fe9-32014903e165",
        enrollmentCount: "1",
      },
      {
        courseTitle: "Viết sáng tạo",
        courseCode: "LIT5",
        courseId: "c547006f-a839-4663-96e1-4a0329a5901c",
        enrollmentCount: "1",
      },
      {
        courseTitle: "Introduction to Programming",
        courseCode: "CS101",
        courseId: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
        enrollmentCount: "1",
      },
    ],
  })
  async getTotalEnrollmentsByCourse() {
    return this.analyticsOptimizationService.getTotalEnrollmentsByCourse();
  }

  @ApiOperation({
    summary: "Get average attendance by course",
    description:
      "Retrieve average attendance per session for each course. Requires admin permissions.",
    tags: ["Analytics - Optimization"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.OPTIMIZATION_AVERAGE_ATTENDANCE)
  @Get("average-attendance")
  @ApiResponse({
    status: 200,
    description: "Average attendance per session by course",
    example: {
      "c547006f-a839-4663-96e1-4a0329a5901c": 0,
      "8a948d08-6d6f-445e-9ade-084ee062c5e1": 2.6666666666666665,
      "7b7970ed-11e6-4fd2-8fe9-32014903e165": 1,
      "bbeb693c-2474-4610-b45e-5a2f45ff686a": 1,
    },
  })
  async getAverageAttendancePerSessionByCourse() {
    const result =
      await this.analyticsOptimizationService.getAverageAttendancePerSessionByCourse();
    return Object.fromEntries(result);
  }

  @ApiOperation({
    summary: "Get attendance rate by course",
    description:
      "Retrieve overall attendance rate for each course. Requires admin permissions.",
    tags: ["Analytics - Optimization"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.OPTIMIZATION_ATTENDANCE_RATE)
  @Get("attendance-rate")
  @ApiResponse({
    status: 200,
    description: "Attendance rate (percentage between 0 and 1) by course",
    example: {
      "7b7970ed-11e6-4fd2-8fe9-32014903e165": 1,
      "8a948d08-6d6f-445e-9ade-084ee062c5e1": 8,
      "bbeb693c-2474-4610-b45e-5a2f45ff686a": 1,
      "c547006f-a839-4663-96e1-4a0329a5901c": 0,
    },
  })
  async getOverallAttendanceRateByCourse() {
    const result =
      await this.analyticsOptimizationService.getOverallAttendanceRateByCourse();
    return Object.fromEntries(result);
  }

  @ApiOperation({
    summary: "Get top users by activity",
    description:
      "Retrieve top users by activity points within a date range. Requires admin permissions.",
    tags: ["Analytics - Optimization"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.OPTIMIZATION_TOP_USERS)
  @Get("top-users")
  @ApiQuery({
    name: "from",
    required: true,
    type: String,
    description:
      "Start date (inclusive) for activity points (ISO string, e.g. 2023-01-01)",
    example: "2023-01-01",
  })
  @ApiQuery({
    name: "to",
    required: true,
    type: String,
    description:
      "End date (inclusive) for activity points (ISO string, e.g. 2023-01-31)",
    example: "2023-02-01",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of top users to return (default 10)",
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: "Top users by activity points",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          userId: { type: "string", example: "user_1" },
          name: { type: "string", example: "Nguyễn Văn A" },
          points: { type: "number", example: 123 },
        },
      },
      example: [
        { userId: "user_1", name: "Nguyễn Văn A", points: 138 },
        { userId: "user_2", name: "Lý Hồng Nhiên", points: 100 },
      ],
    },
  })
  async getTopUsersByActivityPoints(
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("limit") limit?: string,
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const lim = limit ? parseInt(limit, 10) : 10;
    return this.analyticsOptimizationService.getTopUsersByActivityPoints(
      fromDate,
      toDate,
      lim,
    );
  }
}
