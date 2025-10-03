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
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ActivityService } from "./activity.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";

@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOperation({ 
    summary: "Create activity", 
    description: "Create a new activity. Requires admin permissions.",
    tags: ["Activity Management"]
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @ApiOperation({ 
    summary: "Get all activities", 
    description: "Retrieve all activities. Requires admin permissions.",
    tags: ["Activity Management"]
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  findAll() {
    return this.activityService.findAll();
  }

  @ApiOperation({ 
    summary: "Get activity categories", 
    description: "Retrieve all activity categories. No authentication required.",
    tags: ["Activity Management"]
  })
  /* Intentional No Guard */
  @Get("categories")
  getCategories() {
    return this.activityService.getCategories();
  }

  @ApiOperation({ 
    summary: "Get activity by ID", 
    description: "Retrieve a specific activity by its ID. Requires admin permissions.",
    tags: ["Activity Management"]
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_READ_ONE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.activityService.findOne(+id);
  }

  @ApiOperation({ 
    summary: "Update activity", 
    description: "Update an existing activity. Requires admin permissions.",
    tags: ["Activity Management"]
  })
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

  @ApiOperation({ 
    summary: "Delete activity", 
    description: "Delete an activity. Requires admin permissions.",
    tags: ["Activity Management"]
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ACTIVITY_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.activityService.remove(+id);
  }

  
}
