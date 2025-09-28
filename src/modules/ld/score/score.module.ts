import { UserModule } from "@/modules/iam/user/user.module";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CourseModule } from "../course/course.module";
import { ScoreColumn } from "./entities/score-column.entity";
import { Score } from "./entities/score.entity";
import { ScoreColumnService } from "./score-column.service";
import { ScoreController } from "./score.controller";
import { ScoreService } from "./score.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Score, ScoreColumn]),
    CourseModule,
    UserModule,
  ],
  controllers: [ScoreController],
  providers: [ScoreService, ScoreColumnService],
})
export class ScoreModule {}
