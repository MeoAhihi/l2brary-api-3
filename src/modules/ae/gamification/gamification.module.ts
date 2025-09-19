import { Module } from "@nestjs/common";
import { GamificationService } from "./gamification.service";
import { GamificationController } from "./gamification.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityLog } from "./entities/activity-log.entity";
import { UserModule } from "src/modules/iam/user/user.module";
import { ActivityModule } from "../activity/activity.module";

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
