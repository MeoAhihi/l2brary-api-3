import { UserModule } from "@/modules/iam/user/user.module";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CourseModule } from "../course/course.module";
import { AttendanceService } from "./attendace.service";
import { Attendance } from "./entities/attendance.entity";
import { Session } from "./entities/session.entity";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Attendance]),
    CourseModule,
    UserModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, AttendanceService],
  exports: [SessionService],
})
export class SessionModule {}
