import { Exclude, Expose } from "class-transformer";
import { ActivityLog } from "src/modules/ae/gamification/entities/activity-log.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

@Entity("user_profiles")
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  id: string;

  @Column()
  @Expose()
  fullName: string;

  @Column()
  @Expose()
  internationalName: string;

  @Column({
    type: "enum",
    enum: Gender,
  })
  @Expose()
  gender: Gender;

  @Column({ type: "date" })
  @Expose()
  birthdate: Date;

  @Column()
  @Expose()
  phoneNumber: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Exclude()
  password: string;

  // Activity logs for gamification
  // A user can have many activity logs
  // (see src/modules/ae/gamification/entities/activity-log.entity.ts)
  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activityLogs: ActivityLog[];

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
