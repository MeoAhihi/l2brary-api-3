import { ReferenceUserDto } from "@/modules/iam/user/dto/reference-user.dto";
import { User } from "@/modules/iam/user/entities/user.entity";
import { Type } from "class-transformer";
import { Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ReferenceCourseDto } from "../../course/dto/reference-course.dto";
import { Course } from "../../course/entities/course.entity";
import { EnrollmentStatusEnum } from "../../types/enrollment-status.enum";

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn("increment")
  @Expose()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  @Type(() => ReferenceUserDto)
  @Expose()
  user: User;

  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: "courseId" })
  @Type(() => ReferenceCourseDto)
  @Expose()
  course: Course;

  // Enrollment status (pending, approved, rejected)
  @Column({
    type: "enum",
    enum: EnrollmentStatusEnum,
    default: EnrollmentStatusEnum.PENDING,
  })
  @Expose()
  status: EnrollmentStatusEnum;

  @CreateDateColumn()
  @Expose()
  enrolledAt: Date;
}
