import { UserModule } from "src/modules/iam/user/user.module";

import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ActivityModule } from "../activity/activity.module";
import { ActivityLog } from "./entities/activity-log.entity";
import { GamificationController } from "./gamification.controller";
import { GamificationService } from "./gamification.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLog]),
    ActivityModule,
    UserModule,
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
