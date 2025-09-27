import { Exclude, Expose } from "class-transformer";
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Course } from "../../course/entities/course.entity";
import { Game } from "../../game/entities/game.entity";
import { LocationTypeEnum } from "../../types/location-type.enum";
import { SessionStatus } from "../../types/session-status.enum";
import { Attendance } from "./attendance.entity";

@Entity()
export class Session {
  @Expose()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Expose()
  @Column({ nullable: true })
  thumbnail: string;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @ManyToOne(() => Course, (course) => course.sessions)
  course: Course;

  @Expose()
  @Column("text", { nullable: true })
  description?: string;

  @Expose()
  @Column()
  startTime: Date;

  @Expose()
  @Column({ nullable: true })
  endTime?: Date;

  @Expose()
  @Column({ nullable: true })
  presenterName?: string;

  @Expose()
  @Column({
    enum: LocationTypeEnum,
    nullable: true,
    default: LocationTypeEnum.PHYSICAL,
  })
  locationType?: LocationTypeEnum;

  @Expose()
  @Column({ nullable: true, default: "" })
  roomInfo?: string;

  @Expose()
  @Column({ nullable: true, default: "" })
  address?: string;

  @Expose()
  @Column({ nullable: true, type: "int" })
  maxParticipant?: number;

  @Expose()
  @Column({ nullable: true, type: "int", default: 0 })
  lateThreshold?: number;

  @Expose()
  @Column({ nullable: true, type: "boolean", default: true })
  autoCheckIn?: boolean;

  @Expose()
  @Column({ nullable: true, type: "boolean", default: true })
  allowLateJoin?: boolean;

  @Expose()
  @Column({ nullable: true, type: "boolean", default: false })
  enableGame?: boolean;

  @Expose()
  @Column({ nullable: true, type: "boolean", default: false })
  autoScoring?: boolean;

  @Expose()
  @Column({ nullable: true, type: "int", default: 1 })
  maxGamePerSession?: number;

  @Expose()
  @Column({ nullable: true, type: "int", default: 30 })
  gameTimeout?: number;

  @Expose()
  @Column({ nullable: true, type: "boolean", default: false })
  emailNotification?: boolean;

  @Expose()
  @Column({ nullable: true, type: "boolean", default: false })
  smsNotification?: boolean;

  @Expose()
  @Column({ nullable: true, type: "boolean", default: false })
  reminderNotification?: boolean;

  @Exclude()
  @OneToMany(() => Attendance, (attendance) => attendance.session, {
    cascade: true,
  })
  attendances: Attendance[];

  @Exclude()
  @OneToMany(() => Game, (game) => game.session, { cascade: true })
  games: Game[];

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  @Expose()
  get status(): SessionStatus {
    const now = new Date();
    const start = new Date(this.startTime);

    if (!this.endTime) {
      // If there's no end time, just check if the session has started yet
      if (now < start) {
        return SessionStatus.SCHEDULED;
      } else {
        return SessionStatus.ONGOING;
      }
    } else {
      const end = new Date(this.endTime);
      if (now < start) {
        return SessionStatus.SCHEDULED;
      } else if (now >= start && now <= end) {
        return SessionStatus.ONGOING;
      } else if (now > end) {
        return SessionStatus.COMPLETED;
      }
    }
    return SessionStatus.SCHEDULED;
  }

  @Expose()
  get checked(): number {
    // Returns the number of attendances for this session
    if (!Array.isArray(this.attendances)) {
      return 0;
    }
    return this.attendances.length;
  }

  @Expose()
  get totalGame(): number {
    // Returns the number of games for this session
    if (!Array.isArray(this.games)) {
      return 0;
    }
    return this.games.length;
  }
}
