import { User } from "@/modules/iam/user/entities/user.entity";
import { Attendance } from "@/modules/ld/session/entities/attendance.entity";
import { Session } from "@/modules/ld/session/entities/session.entity";
import { Activity } from "src/modules/ae/activity/entities/activity.entity";
import { ActivityLog } from "src/modules/ae/gamification/entities/activity-log.entity";
import { Article } from "src/modules/ks/article/entities/article.entity";
import { Course } from "src/modules/ld/course/entities/course.entity";
import { Enrollment } from "src/modules/ld/enrollment/entities/enrollment.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DemographicController } from "./demographic/demographic.controller";
import { DemographicService } from "./demographic/demographic.service";
import { AnalyticsOptimizationController } from "./optimization/analytics.optimization.controller";
import { AnalyticsOptimizationService } from "./optimization/analytics.optimization.service";
import { TrackGrowthController } from "./track-growth/analytics.track-growth.controller";
import { TrackGrowthService } from "./track-growth/analytics.track-growth.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Course,
      Enrollment,
      Article,
      Activity,
      ActivityLog,
      Session,
      Attendance,
    ]),
  ],
  controllers: [
    TrackGrowthController,
    AnalyticsOptimizationController,
    DemographicController,
  ],
  providers: [
    TrackGrowthService,
    AnalyticsOptimizationService,
    DemographicService,
  ],
})
export class AnalyticsModule {}
