import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Attendance } from "./attendance.entity";
import { Game } from "../../game/entities/game.entity";

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  title: string;

  @CreateDateColumn()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  presenterName: string;

  @OneToMany(() => Attendance, (attendance) => attendance.session, {
    cascade: true,
  })
  attendances: Attendance[];

  @OneToMany(() => Game, (game) => game.session, { cascade: true })
  games: Game[];
}
