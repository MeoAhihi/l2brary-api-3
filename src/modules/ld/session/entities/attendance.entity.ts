import { User } from "@/modules/iam/user/entities/user.entity";
import { Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Session } from "./session.entity";

@Entity("attendance")
export class Attendance {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Expose()
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Expose()
  @Column({
    name: "attend_time",
  })
  attendTime: Date;

  @ManyToOne(() => Session, (session) => session.attendances)
  session: Session;
}
