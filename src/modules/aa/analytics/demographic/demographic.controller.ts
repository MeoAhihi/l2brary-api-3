import { Controller, Get } from "@nestjs/common";

import { DemographicService } from "./demographic.service";

@Controller("demographic")
export class DemographicController {
  constructor(private readonly demographicService: DemographicService) {}

  @Get("rank")
  async getUsersByRank() {
    return this.demographicService.countUsersByRank();
  }

  @Get("gender")
  async getUsersByGender() {
    return this.demographicService.countUsersByGender();
  }

  @Get("age")
  async getUsersByAge() {
    return this.demographicService.countUsersByAge();
  }
}
