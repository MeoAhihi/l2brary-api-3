import { Exclude, Expose } from "class-transformer";
import { ActivityLog } from "@/modules/ae/gamification/entities/activity-log.entity";
import { Article } from "@/modules/ks/article/entities/article.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Gender } from "../../types/gender.enum";
import { Role } from "../../authorization/entities/role.entity";

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

  @Column({ unique: true })
  @Expose()
  phoneNumber: string;

  @Column()
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
  @Expose()
  activityLogs: ActivityLog[];

  @OneToMany(() => Article, (article) => article.author)
  @Expose()
  articles: Article[];

  @ManyToMany(() => Role, (role) => role.users)
  @Expose()
  roles: Role[];
}
