import { UserModule } from "src/modules/iam/user/user.module";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ActivityModule } from "../activity/activity.module";
import { ActivityLog } from "./entities/activity-log.entity";
import { GamificationController } from "./gamification.controller";
import { GamificationService } from "./gamification.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLog]),
    ActivityModule,
    UserModule,
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
})
export class GamificationModule {}
