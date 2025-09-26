import { Injectable } from "@nestjs/common";

import { GamificationService } from "./modules/ae/gamification/gamification.service";
import { SystemActivity } from "./modules/ae/types/system-activities";

@Injectable()
export class AppService {
  constructor(private readonly gamificationService: GamificationService) {}

  async getHello(userId: string): Promise<string> {
    await this.gamificationService.systemLogActivity(
      userId,
      SystemActivity.ENROLLMENT_APPROVED,
      "Action completed from Root Domain",
    );
    return "Hello World!";
  }
}
