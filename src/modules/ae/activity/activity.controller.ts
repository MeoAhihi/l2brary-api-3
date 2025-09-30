import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { ActivityService } from "./activity.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";

@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  findAll() {
    return this.activityService.findAll();
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_READ_ONE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.activityService.findOne(+id);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(+id, updateActivityDto);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.activityService.remove(+id);
  }

  /* Intentional No Guard */
  @Get("categories")
  getCategories() {
    return this.activityService.getCategories();
  }
}
