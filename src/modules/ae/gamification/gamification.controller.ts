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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

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
  @ApiCreatedResponse({
    example: {
      id: 24,
      user: {
        id: "367276c4-f513-4331-86fe-be31f488960c",
        fullName: "Johny Doe",
        internationalName: "J. Doe",
      },
      activity: {
        id: 1,
        name: "Quiz",
        point: 5,
        category: "Assessment",
      },
      loggedBy: "Johny Doe/367276c4-f513-4331-86fe-be31f488960c",
      note: "Completed extra tasks",
      createdAt: "2025-10-11T07:08:21.274Z",
    },
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
  @ApiOkResponse({
    example: {
      items: [
        {
          id: 24,
          user: {
            id: "367276c4-f513-4331-86fe-be31f488960c",
            fullName: "Johny Doe",
            internationalName: "J. Doe",
          },
          activity: {
            id: 1,
            name: "Quiz",
            point: 5,
            category: "Assessment",
          },
          loggedBy: "Johny Doe/367276c4-f513-4331-86fe-be31f488960c",
          note: "Completed extra tasks",
          createdAt: "2025-10-11T07:08:21.274Z",
        },
      ],
      total: 18,
      page: 1,
      limit: 10,
      pageCount: 2,
    },
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
  @ApiOkResponse({
    example: {
      userId: "367276c4-f513-4331-86fe-be31f488960c",
      engagementScore: 69,
      activityLogs: [
        {
          id: 24,
          activity: {
            id: 1,
            name: "Quiz",
            point: 5,
            category: "Assessment",
            isManual: true,
          },
          loggedBy: "Johny Doe/367276c4-f513-4331-86fe-be31f488960c",
          note: "Completed extra tasks",
          createdAt: "2025-10-11T07:08:21.274Z",
        },
        {
          id: 23,
          activity: {
            id: 73,
            name: "Enrollment Approved",
            point: 3,
            category: "system",
            isManual: false,
          },
          loggedBy: "system",
          note: "Action completed from L&D Domain",
          createdAt: "2025-10-11T05:47:18.736Z",
        },
        {
          id: 22,
          activity: {
            id: 70,
            name: "Course Updated",
            point: 5,
            category: "system",
            isManual: false,
          },
          loggedBy: "Johny Doe/367276c4-f513-4331-86fe-be31f488960c",
          note: "Completed extra tasks",
          createdAt: "2025-10-03T06:39:52.652Z",
        },
      ],
    },
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
