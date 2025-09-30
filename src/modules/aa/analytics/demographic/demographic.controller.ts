import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { DemographicService } from "./demographic.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("demographic")
export class DemographicController {
  constructor(private readonly demographicService: DemographicService) {}

  @RequirePermission(PermissionEnum.DEMOGRAPHIC_RANK_READ)
  @Get("rank")
  async getUsersByRank() {
    return this.demographicService.countUsersByRank();
  }

  @RequirePermission(PermissionEnum.DEMOGRAPHIC_GENDER_READ)
  @Get("gender")
  async getUsersByGender() {
    return this.demographicService.countUsersByGender();
  }

  @RequirePermission(PermissionEnum.DEMOGRAPHIC_AGE_READ)
  @Get("age")
  async getUsersByAge() {
    return this.demographicService.countUsersByAge();
  }
}
