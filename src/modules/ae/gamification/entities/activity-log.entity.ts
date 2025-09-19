import { User } from "src/modules/iam/user/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Activity } from "../../activity/entities/activity.entity";

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.activityLogs)
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.activityLogs)
  activity: Activity;

  @Column({ type: "varchar" })
  loggedBy: string;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;
}
