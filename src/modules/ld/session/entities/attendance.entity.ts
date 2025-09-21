import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { Session } from "./session.entity";
import { User } from "src/modules/iam/user/entities/user.entity";

@Entity("attendance")
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    name: "attend_time",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  attendTime: Date;

  @ManyToOne(() => Session, (session) => session.attendances)
  session: Session;
}
