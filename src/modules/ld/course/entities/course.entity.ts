import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ScheduleDetail, ScheduleType } from "../types/schedule.types";

@Entity({ name: "courses" })
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  code: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  difficulty: string;

  @Column({ type: "boolean", default: false })
  isPublic: boolean;

  @Column({ type: "boolean", default: false })
  isRequireApproval: boolean;

  @Column({ type: "boolean", default: false })
  isAllowGuestAccess: boolean;

  @Column({ type: "text", nullable: true })
  thumbnail: string;

  @Column({ type: "int", nullable: true })
  maxStudents: number;

  @Column({ type: "date", nullable: true })
  enrollmentDeadline: Date;

  @Column({ type: "varchar", length: 255 })
  group: string;

  @Column({ type: "varchar", length: 20 })
  scheduleType: ScheduleType;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date;

  @Column({ type: "json" })
  scheduleDetail: ScheduleDetail;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  get isRecurrent(): boolean {
    // WEEKLY, MONTHLY, LUNAR_MONTHLY are recurrent; ONE_TIME is not
    return (
      this.scheduleType === ScheduleType.WEEKLY ||
      this.scheduleType === ScheduleType.MONTHLY ||
      this.scheduleType === ScheduleType.LUNAR_MONTHLY
    );
  }

  get isEnrollable(): boolean {
    // Returns true if the course is open for enrollment (before the enrollmentDeadline, or no deadline)
    if (!this.enrollmentDeadline) {
      return true;
    }
    const now = new Date();
    // enrollmentDeadline is inclusive (can enroll until the end of the day)
    const deadline = new Date(this.enrollmentDeadline);
    deadline.setHours(23, 59, 59, 999);
    return now <= deadline;
  }

  get isStarted(): boolean {
    // Returns true if the course has started (today >= startDate)
    if (!this.startDate) {
      return false;
    }
    const now = new Date();
    // Compare only the date part (ignore time)
    const start = new Date(this.startDate);
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return now >= start;
  }

  get isEnded(): boolean {
    // Returns true if the course has ended (today > endDate), or false if no endDate
    if (!this.endDate) {
      return false;
    }
    const now = new Date();
    // Compare only the date part (ignore time)
    const end = new Date(this.endDate);
    end.setHours(23, 59, 59, 999);
    return now > end;
  }
}
