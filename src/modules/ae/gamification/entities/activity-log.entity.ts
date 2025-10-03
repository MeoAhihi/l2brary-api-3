import { ReferenceUserDto } from "@/modules/iam/user/dto/reference-user.dto";
import { User } from "@/modules/iam/user/entities/user.entity";
import { Expose, Type } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Activity } from "../../activity/entities/activity.entity";

@Entity()
export class ActivityLog {
  @Expose()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Expose()
  @ManyToOne(() => User, (user) => user.activityLogs)
  @Type(() => ReferenceUserDto)
  user: User;

  @Expose()
  @ManyToOne(() => Activity, (activity) => activity.activityLogs)
  activity: Activity;

  @Expose()
  @Column({ type: "varchar" })
  loggedBy: string;

  @Expose()
  @Column({ nullable: true })
  note?: string;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;
}
