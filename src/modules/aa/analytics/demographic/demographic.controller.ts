import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { DemographicService } from "./demographic.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("demographic")
export class DemographicController {
  constructor(private readonly demographicService: DemographicService) {}

  @ApiOperation({
    summary: "Get users by rank",
    description:
      "Retrieve user distribution by rank. Requires admin permissions.",
    tags: ["Analytics - Demographic"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.DEMOGRAPHIC_RANK_READ)
  @Get("rank")
  @ApiResponse({
    status: 200,
    description: "Array of user counts grouped by rank",
    example: [
      {
        rank: "Junior",
        count: 1,
      },
      {
        rank: null,
        count: 10,
      },
    ],
  })
  async getUsersByRank() {
    return this.demographicService.countUsersByRank();
  }

  @ApiOperation({
    summary: "Get users by gender",
    description:
      "Retrieve user distribution by gender. Requires admin permissions.",
    tags: ["Analytics - Demographic"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.DEMOGRAPHIC_GENDER_READ)
  @Get("gender")
  @ApiResponse({
    status: 200,
    description: "Array of user counts grouped by gender",
    example: [
      {
        gender: "male",
        count: 5,
      },
      {
        gender: "female",
        count: 6,
      },
    ],
  })
  async getUsersByGender() {
    return this.demographicService.countUsersByGender();
  }

  @ApiOperation({
    summary: "Get users by age",
    description:
      "Retrieve user distribution by age groups. Requires admin permissions.",
    tags: ["Analytics - Demographic"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.DEMOGRAPHIC_AGE_READ)
  @Get("age")
  @ApiResponse({
    status: 200,
    description: "Array of user counts grouped by age",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          age: { type: "integer", example: 18 },
          count: { type: "integer", example: 5 },
        },
      },
      example: [
        { age: 18, count: 5 },
        { age: 20, count: 8 },
      ],
    },
  })
  async getUsersByAge() {
    return this.demographicService.countUsersByAge();
  }
}
