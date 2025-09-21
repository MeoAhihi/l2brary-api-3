import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Attendance } from "./attendance.entity";
import { Game } from "../../game/entities/game.entity";
import { Course } from "../../course/entities/course.entity";
import { SessionStatus } from "../../types/session-status.enum";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class Session {
  @Expose()
  @PrimaryGeneratedColumn()
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
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  startTime: Date;

  @Expose()
  @Column()
  endTime: Date;

  @Expose()
  @Column()
  presenterName: string;

  @Expose()
  @OneToMany(() => Attendance, (attendance) => attendance.session, {
    cascade: true,
  })
  attendances: Attendance[];

  @Expose()
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
    const end = new Date(this.endTime);

    if (now < start) {
      return SessionStatus.SCHEDULED;
    } else if (now >= start && now <= end) {
      return SessionStatus.ONGOING;
    } else if (now > end) {
      return SessionStatus.COMPLETED;
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
