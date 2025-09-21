import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Session } from "./session.entity";

@Entity("attendance")
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @CreateDateColumn({ name: "attend_time" })
  attendTime: Date;

  @Column({ type: "enum", enum: ["online", "offline"] })
  mode: "online" | "offline";

  @ManyToOne(() => Session, (session) => session.attendances, { cascade: true })
  session: Session;
}
