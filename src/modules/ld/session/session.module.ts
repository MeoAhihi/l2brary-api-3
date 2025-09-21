import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./entities/session.entity";
import { Attendance } from "./entities/attendance.entity";
import { CourseModule } from "../course/course.module";
import { Game } from "../game/entities/game.entity";
import { GameLog } from "../game/entities/game-log.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Attendance, Game, GameLog]),
    CourseModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
