import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ActivityLog } from "../../gamification/entities/activity-log.entity";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class Activity {
  @Expose()
  @PrimaryGeneratedColumn("increment")
  id: number;
  
  @Expose()
  @Column({ unique: true })
  name: string;
  
  @Expose()
  @Column("int")
  point: number;
  
  @Expose()
  @Column()
  category: string;
  
  @Exclude()
  @Column({ default: false })
  isManual: boolean;
  
  @Exclude()
  @OneToMany(() => ActivityLog, (activityLog) => activityLog.activity)
  activityLogs: ActivityLog[];
}
