import { Module } from "@nestjs/common";
import { EnrollmentService } from "./enrollment.service";
import { EnrollmentController } from "./enrollment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Enrollment } from "./entities/enrollment.entity";
import { UserModule } from "src/modules/iam/user/user.module";
import { CourseModule } from "../course/course.module";

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment]), UserModule, CourseModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
