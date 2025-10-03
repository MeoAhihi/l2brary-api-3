import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";
import { AuthRequest } from "@/modules/iam/types/auth-request.type";
import { plainToInstance } from "class-transformer";

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery } from "@nestjs/swagger";

import { LogActivityDto } from "./dto/log-activity.dto";
import { ActivityLog } from "./entities/activity-log.entity";
import { GamificationService } from "./gamification.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("gamification")
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @ApiOperation({
    summary: "Log gamification activity",
    description:
      "Log user activity for gamification tracking. Requires JWT authentication.",
    tags: ["Gamification"],
  })
  @RequirePermission(PermissionEnum.GAMIFICATION_LOG_ACTIVITY)
  @Post("log-activity")
  async create(
    @Body() logActivityDto: LogActivityDto,
    @Req() req: AuthRequest,
  ) {
    const activityLog = await this.gamificationService.create(
      req.user.fullName + "/" + req.user.sub,
      logActivityDto,
    );
    return plainToInstance(ActivityLog, activityLog, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Get gamification data",
    description:
      "Retrieve gamification data with filtering options. Requires admin permissions.",
    tags: ["Gamification"],
  })
  @RequirePermission(PermissionEnum.GAMIFICATION_READ_ALL)
  @Get()
  @ApiQuery({
    name: "userId",
    required: false,
    type: String,
    description: "User identifier",
  })
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
  async findAll(
    @Param("userId") userId: string,
    @Param("page") page: string = "1",
    @Param("limit") limit: string = "10",
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const activityLogs = await this.gamificationService.findAll({
      userId,
      page: pageNumber,
      limit: limitNumber,
    });
    activityLogs.items = plainToInstance(ActivityLog, activityLogs.items, {
      excludeExtraneousValues: true,
    });
    return activityLogs;
  }

  @ApiOperation({
    summary: "Get user activity report",
    description:
      "Generate an activity report for a specific user. Requires admin permissions.",
    tags: ["Gamification"],
  })
  @Get("report/:userId")
  // @ApiQuery({s
  //   name: "startDate",
  //   required: false,
  //   type: String,
  //   description: "Start date for filtering activity logs (ISO 8601 format)",
  // })
  // @ApiQuery({
  //   name: "endDate",
  //   required: false,
  //   type: String,
  //   description: "End date for filtering activity logs (ISO 8601 format)",
  // })
  async getActivityReportOfUser(
    @Param("userId") userId: string,
    // @Query("startDate") startDate?: string,
    // @Query("endDate") endDate?: string
  ) {
    return this.gamificationService.getActivityReportOfUser(
      userId,
      // ,{
      // startDate: new Date(startDate),
      // endDate: new Date(),
      // }
    );
  }
}
