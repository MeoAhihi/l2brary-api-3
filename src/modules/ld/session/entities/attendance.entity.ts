import { User } from "@/modules/iam/user/entities/user.entity";
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
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    name: "attend_time",
  })
  attendTime: Date;

  @ManyToOne(() => Session, (session) => session.attendances)
  session: Session;
}
