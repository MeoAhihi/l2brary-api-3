import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { DemographicService } from "./demographic.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("demographic")
export class DemographicController {
  constructor(private readonly demographicService: DemographicService) {}

  @ApiOperation({ 
    summary: "Get users by rank", 
    description: "Retrieve user distribution by rank. Requires admin permissions.",
    tags: ["Analytics - Demographic"]
  })
  @RequirePermission(PermissionEnum.DEMOGRAPHIC_RANK_READ)
  @Get("rank")
  async getUsersByRank() {
    return this.demographicService.countUsersByRank();
  }

  @ApiOperation({ 
    summary: "Get users by gender", 
    description: "Retrieve user distribution by gender. Requires admin permissions.",
    tags: ["Analytics - Demographic"]
  })
  @RequirePermission(PermissionEnum.DEMOGRAPHIC_GENDER_READ)
  @Get("gender")
  async getUsersByGender() {
    return this.demographicService.countUsersByGender();
  }

  @ApiOperation({ 
    summary: "Get users by age", 
    description: "Retrieve user distribution by age groups. Requires admin permissions.",
    tags: ["Analytics - Demographic"]
  })
  @RequirePermission(PermissionEnum.DEMOGRAPHIC_AGE_READ)
  @Get("age")
  async getUsersByAge() {
    return this.demographicService.countUsersByAge();
  }
}
