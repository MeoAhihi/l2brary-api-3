import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CourseModule } from "../course/course.module";
import { GameLog } from "../game/entities/game-log.entity";
import { Game } from "../game/entities/game.entity";
import { Attendance } from "./entities/attendance.entity";
import { Session } from "./entities/session.entity";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { UserModule } from "@/modules/iam/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Attendance, Game, GameLog]),
    CourseModule,
    UserModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
