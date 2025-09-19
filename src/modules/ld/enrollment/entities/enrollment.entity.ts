import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { User } from "src/modules/iam/user/entities/user.entity";
import { Course } from "../../course/entities/course.entity";
import { EnrollmentStatusEnum } from "../types/enrollment-status.enum";

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: "courseId" })
  course: Course;

  // Enrollment status (pending, approved, rejected)
  @Column({
    type: "enum",
    enum: EnrollmentStatusEnum,
    default: EnrollmentStatusEnum.PENDING,
  })
  status: EnrollmentStatusEnum;

  @CreateDateColumn()
  enrolledAt: Date;
}
