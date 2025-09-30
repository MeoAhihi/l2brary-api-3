import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AnalyticsOptimizationService } from "./analytics.optimization.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("analytics/optimization")
export class AnalyticsOptimizationController {
  constructor(
    private readonly analyticsOptimizationService: AnalyticsOptimizationService,
  ) {}

  // Get total enrollments by course
  @RequirePermission(PermissionEnum.OPTIMIZATION_TOTAL_ENROLLMENTS)
  @Get("total-enrollments")
  async getTotalEnrollmentsByCourse() {
    const result =
      await this.analyticsOptimizationService.getTotalEnrollmentsByCourse();
    // Convert Map to object for JSON response
    return Object.fromEntries(result);
  }

  // Get average attendance per session by course
  @RequirePermission(PermissionEnum.OPTIMIZATION_AVERAGE_ATTENDANCE)
  @Get("average-attendance")
  async getAverageAttendancePerSessionByCourse() {
    const result =
      await this.analyticsOptimizationService.getAverageAttendancePerSessionByCourse();
    return Object.fromEntries(result);
  }

  // Get overall attendance rate by course
  @RequirePermission(PermissionEnum.OPTIMIZATION_ATTENDANCE_RATE)
  @Get("attendance-rate")
  async getOverallAttendanceRateByCourse() {
    const result =
      await this.analyticsOptimizationService.getOverallAttendanceRateByCourse();
    return Object.fromEntries(result);
  }

  // Get top N users by activity points in a given period
  @RequirePermission(PermissionEnum.OPTIMIZATION_TOP_USERS)
  @Get("top-users")
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
