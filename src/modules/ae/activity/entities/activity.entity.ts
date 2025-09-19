import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ActivityLog } from "../../gamification/entities/activity-log.entity";

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("int")
  point: number;

  @Column()
  category: string;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.activity)
  activityLogs: ActivityLog[];
}
