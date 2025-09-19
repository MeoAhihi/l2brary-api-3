import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { GamificationService } from "./gamification.service";
import { UpdateGamificationDto } from "./dto/update-gamification.dto";
import { LogActivityDto } from "./dto/log-activity.dto";
import { ApiQuery } from "@nestjs/swagger";

@Controller("gamification")
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post("log-activity")
  create(@Body() logActivityDto: LogActivityDto) {
    return this.gamificationService.create("user", logActivityDto);
  }

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
    @Param("limit") limit: string = "10"
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.gamificationService.findAll({
      userId,
      page: pageNumber,
      limit: limitNumber,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.gamificationService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateGamificationDto: UpdateGamificationDto
  ) {
    return this.gamificationService.update(+id, updateGamificationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.gamificationService.remove(+id);
  }

  @Get("report/:userId")
  // @ApiQuery({
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
    @Param("userId") userId: string
    // @Query("startDate") startDate?: string,
    // @Query("endDate") endDate?: string
  ) {
    return this.gamificationService.getActivityReportOfUser(
      userId
      // ,{
      // startDate: new Date(startDate),
      // endDate: new Date(),
      // }
    );
  }
}
