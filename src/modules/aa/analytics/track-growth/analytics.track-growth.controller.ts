import { Body, Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { TrackGrowthService } from "./analytics.track-growth.service";

@Controller("analytics/track-growth")
export class TrackGrowthController {
  constructor(private readonly trackGrowthservice: TrackGrowthService) {}

  @Get("users/count")
  async countUsers() {
    return { count: await this.trackGrowthservice.countUsers() };
  }

  @Get("users/new")
  async countNewUsers(@Body("from") from: string, @Body("to") to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return {
      count: await this.trackGrowthservice.countNewUsers(fromDate, toDate),
    };
  }

  @Get("users/active")
  @ApiOperation({ summary: "Get active users with minimum score" })
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

  @Get("users/active/count")
  @ApiOperation({ summary: "Count of active users with minimum score" })
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

  @Get("users/inactive")
  @ApiOperation({ summary: "Get inactive users with maximum score" })
  @ApiQuery({
    name: "maxscore",
    required: false,
    type: Number,
    description: "Maximum total score to be considered inactive (default 0)",
  })
  @ApiResponse({
    status: 200,
    description: "List of inactive users",
    type: [Object],
  })
  async getInactiveUsers(@Query("maxscore") maxScore?: number) {
    return await this.trackGrowthservice.getInactiveUsers(
      typeof maxScore === "number" ? maxScore : 0,
    );
  }

  @Get("users/inactive/count")
  @ApiOperation({ summary: "Count of inactive users with maximum score" })
  @ApiQuery({
    name: "maxscore",
    required: false,
    type: Number,
    description: "Maximum total score to be considered inactive (default 0)",
  })
  @ApiResponse({
    status: 200,
    description: "Count of inactive users",
    type: Number,
  })
  async countInactiveUsers(@Query("maxscore") maxScore?: number) {
    return {
      count: await this.trackGrowthservice.countInactiveUsers(
        typeof maxScore === "number" ? maxScore : 0,
      ),
    };
  }

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

  @Get("users/monthly")
  async countUsersByMonthLast12() {
    return await this.trackGrowthservice.countNewUsersByMonthLast12();
  }

  @Get("users/gender-breakdown")
  async getUserBreakdownByGender() {
    return await this.trackGrowthservice.getUserBreakdownByGender();
  }

  @Get("users/age-breakdown")
  async getUserBreakdownByAge() {
    return await this.trackGrowthservice.getUserBreakdownByAge();
  }
}
