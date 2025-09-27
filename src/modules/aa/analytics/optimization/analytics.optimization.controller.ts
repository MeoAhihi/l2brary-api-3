import { Controller, Get, Query } from "@nestjs/common";

import { AnalyticsOptimizationService } from "./analytics.optimization.service";

@Controller("analytics/optimization")
export class AnalyticsOptimizationController {
  constructor(
    private readonly analyticsOptimizationService: AnalyticsOptimizationService,
  ) {}

  // Get total enrollments by course
  @Get("total-enrollments")
  async getTotalEnrollmentsByCourse() {
    const result =
      await this.analyticsOptimizationService.getTotalEnrollmentsByCourse();
    // Convert Map to object for JSON response
    return Object.fromEntries(result);
  }

  // Get average attendance per session by course
  @Get("average-attendance")
  async getAverageAttendancePerSessionByCourse() {
    const result =
      await this.analyticsOptimizationService.getAverageAttendancePerSessionByCourse();
    return Object.fromEntries(result);
  }

  // Get overall attendance rate by course
  @Get("attendance-rate")
  async getOverallAttendanceRateByCourse() {
    const result =
      await this.analyticsOptimizationService.getOverallAttendanceRateByCourse();
    return Object.fromEntries(result);
  }

  // Get top N users by activity points in a given period
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
