import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ActivityLog } from "../../gamification/entities/activity-log.entity";

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column("int")
  point: number;

  @Column()
  category: string;

  @Column({ default: false })
  isManual: boolean;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.activity)
  activityLogs: ActivityLog[];
}
