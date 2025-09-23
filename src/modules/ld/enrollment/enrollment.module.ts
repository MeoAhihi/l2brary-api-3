import { UserModule } from "src/modules/iam/user/user.module";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CourseModule } from "../course/course.module";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentService } from "./enrollment.service";
import { Enrollment } from "./entities/enrollment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment]), UserModule, CourseModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
