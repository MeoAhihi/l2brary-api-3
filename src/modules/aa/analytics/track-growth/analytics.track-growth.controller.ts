import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import { Body, Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

import { TrackGrowthService } from "./analytics.track-growth.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("analytics/track-growth")
export class TrackGrowthController {
  constructor(private readonly trackGrowthservice: TrackGrowthService) {}

  @ApiOperation({
    summary: "Get total user count",
    description:
      "Retrieve the total number of users in the system. Requires admin permissions.",
    tags: ["Analytics - Track Growth"],
  })
  @RequirePermission(PermissionEnum.TRACK_GROWTH_USERS_COUNT)
  @Get("users/count")
  async countUsers() {
    return { count: await this.trackGrowthservice.countUsers() };
  }

  @ApiQuery({
    name: "from",
    required: true,
    type: String,
    description: "Start date (inclusive) in ISO format (e.g., 2023-01-01)",
  })
  @ApiQuery({
    name: "to",
    required: true,
    type: String,
    description: "End date (inclusive) in ISO format (e.g., 2023-01-31)",
  })
  @ApiOperation({
    summary: "Get new users count",
    description:
      "Retrieve the count of new users within a date range. Requires admin permissions.",
    tags: ["Analytics - Track Growth"],
  })
  @RequirePermission(PermissionEnum.TRACK_GROWTH_USERS_NEW)
  @Get("users/new")
  async countNewUsers(@Query("from") from: string, @Query("to") to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return {
      count: await this.trackGrowthservice.countNewUsers(fromDate, toDate),
    };
  }

  @ApiOperation({
    summary: "Get active users",
    description:
      "Retrieve active users with minimum score threshold. Requires admin permissions.",
    tags: ["Analytics - Track Growth"],
  })
  @RequirePermission(PermissionEnum.TRACK_GROWTH_USERS_ACTIVE)
  @Get("users/active")
  @ApiQuery({
    name: "minscore",
    required: false,
    type: Number,
    description: "Minimum total score to be considered active",
  })
  @ApiResponse({
    status: 200,
    description: "List of active users",
    type: [Object],
  })
  async getActiveUsers(@Query("minscore") minScore?: number) {
    return await this.trackGrowthservice.getActiveUsers(minScore);
  }

  @ApiOperation({
    summary: "Count active users",
    description:
      "Get the count of active users with minimum score threshold. Requires admin permissions.",
    tags: ["Analytics - Track Growth"],
  })
  @RequirePermission(PermissionEnum.TRACK_GROWTH_USERS_ACTIVE_COUNT)
  @Get("users/active/count")
  @ApiQuery({
    name: "minscore",
    required: false,
    type: Number,
    description: "Minimum total score to be considered active",
  })
  @ApiResponse({
    status: 200,
    description: "Count of active users",
    type: Number,
  })
  async countActiveUsers(@Query("minscore") minScore?: number) {
    return { count: await this.trackGrowthservice.countActiveUsers(minScore) };
  }

  @ApiOperation({
    summary: "Get inactive users",
    description:
      "Retrieve inactive users with maximum score and optional date filtering. Requires admin permissions.",
    tags: ["Analytics - Track Growth"],
  })
  @RequirePermission(PermissionEnum.TRACK_GROWTH_USERS_INACTIVE)
  @Get("users/inactive")
  @ApiQuery({
    name: "maxscore",
    required: false,
    type: Number,
    description: "Maximum total score to be considered inactive (default 0)",
  })
  @ApiQuery({
    name: "from",
    required: false,
    type: Date,
    description:
      "Start date (ISO string) for filtering users by inactivity period",
  })
  @ApiQuery({
    name: "to",
    required: false,
    type: Date,
    description:
      "End date (ISO string) for filtering users by inactivity period",
  })
  @ApiResponse({
    status: 200,
    description: "List of inactive users",
    type: [Object],
  })
  async getInactiveUsers(
    @Query("maxscore") maxScore?: number,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return await this.trackGrowthservice.getInactiveUsers(
      typeof maxScore === "number" ? maxScore : 0,
      fromDate,
      toDate,
    );
  }

  @ApiOperation({
    summary: "Count inactive users",
    description:
      "Get the count of inactive users with maximum score and optional date filtering. Requires admin permissions.",
    tags: ["Analytics - Track Growth"],
  })
  @RequirePermission(PermissionEnum.TRACK_GROWTH_USERS_INACTIVE_COUNT)
  @Get("users/inactive/count")
  @ApiQuery({
    name: "maxscore",
    required: false,
    type: Number,
    description: "Maximum total score to be considered inactive (default 0)",
  })
  @ApiQuery({
    name: "from",
    required: false,
    type: Date,
    description:
      "Start date (ISO string) for filtering users by inactivity period",
  })
  @ApiQuery({
    name: "to",
    required: false,
    type: Date,
    description:
      "End date (ISO string) for filtering users by inactivity period",
  })
  @ApiResponse({
    status: 200,
    description: "Count of inactive users",
    type: Number,
  })
  async countInactiveUsers(
    @Query("maxscore") maxScore?: number,
    @Query("from") from?: Date,
    @Query("to") to?: Date,
  ) {
    return {
      count: await this.trackGrowthservice.countInactiveUsers(
        typeof maxScore === "number" ? maxScore : 0,
        from,
        to,
      ),
    };
  }

  @ApiOperation({
    summary: "Get user retention rate",
    description:
      "Calculate user retention rate between two periods. Requires admin permissions.",
    tags: ["Analytics - Track Growth"],
  })
  @RequirePermission(PermissionEnum.TRACK_GROWTH_USERS_RETENTION_RATE)
  @Get("users/retention-rate")
  async getRetentionRate(
    @Query("prevFrom") prevFrom: string,
    @Query("prevTo") prevTo: string,
    @Query("currFrom") currFrom: string,
    @Query("currTo") currTo: string,
  ) {
    if (!prevFrom || !prevTo || !currFrom || !currTo) {
      return {
        error:
          "Missing required query parameters: prevFrom, prevTo, currFrom, currTo",
      };
    }
    const prevFromDate = new Date(prevFrom);
    const prevToDate = new Date(prevTo);
    const currFromDate = new Date(currFrom);
    const currToDate = new Date(currTo);
    return await this.trackGrowthservice.getRetentionRate(
      prevFromDate,
      prevToDate,
      currFromDate,
      currToDate,
    );
  }

  @ApiOperation({
    summary: "Get monthly user growth",
    description:
      "Retrieve monthly user growth data for the last 12 months. Requires admin permissions.",
    tags: ["Analytics - Track Growth"],
  })
  @RequirePermission(PermissionEnum.TRACK_GROWTH_USERS_MONTHLY)
  @Get("users/monthly")
  async countUsersByMonthLast12() {
    return await this.trackGrowthservice.countNewUsersByMonthLast12();
  }
}
