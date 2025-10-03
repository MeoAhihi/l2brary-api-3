import { Exclude, Expose, Type } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ReferenceSessionDto } from "../../session/dto/reference-session.dto";
import { Session } from "../../session/entities/session.entity";
import { GameLog } from "./game-log.entity";

@Entity()
export class Game {
  @PrimaryGeneratedColumn("increment")
  @Expose()
  id: number;

  @ManyToOne(() => Session, (session) => session.games)
  @Type(() => ReferenceSessionDto)
  @Expose()
  session: Session;

  @OneToMany(() => GameLog, (gameLog) => gameLog.game)
  @Type(() => GameLog)
  @Expose()
  gameLogs: GameLog[];

  @Column({ type: "bool", default: false })
  @Expose()
  isSubmitted: boolean;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;
}
