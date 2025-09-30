import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

import { LogActivityDto } from "./dto/log-activity.dto";
import { GamificationService } from "./gamification.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("gamification")
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @RequirePermission(PermissionEnum.GAMIFICATION_LOG_ACTIVITY)
  @Post("log-activity")
  create(@Body() logActivityDto: LogActivityDto) {
    return this.gamificationService.create("user", logActivityDto);
  }

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
  findAll(
    @Param("userId") userId: string,
    @Param("page") page: string = "1",
    @Param("limit") limit: string = "10",
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.gamificationService.findAll({
      userId,
      page: pageNumber,
      limit: limitNumber,
    });
  }

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
