import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Activity } from "src/modules/ae/activity/entities/activity.entity";
import { ActivityLog } from "src/modules/ae/gamification/entities/activity-log.entity";
import { User } from "src/modules/iam/user/entities/user.entity";
import { Article } from "src/modules/ks/article/entities/article.entity";
import { Course } from "src/modules/ld/course/entities/course.entity";
import { Enrollment } from "src/modules/ld/enrollment/entities/enrollment.entity";
import {
  TrackGrowthController
} from "./track-growth/analytics.track-growth.controller";
import {
  TrackGrowthService
} from "./track-growth/analytics.track-growth.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Course,
      Enrollment,
      Article,
      Activity,
      ActivityLog,
    ]),
  ],
  controllers: [TrackGrowthController],
  providers: [TrackGrowthService],
})
export class AnalyticsModule {}
