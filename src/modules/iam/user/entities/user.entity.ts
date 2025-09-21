import { Exclude, Expose } from "class-transformer";
import { ActivityLog } from "src/modules/ae/gamification/entities/activity-log.entity";
import { Article } from "src/modules/ks/article/entities/article.entity";
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

  @Column()
  @Expose()
  birthdate: string;

  @Column()
  @Expose()
  phoneNumber: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activityLogs: ActivityLog[];

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
