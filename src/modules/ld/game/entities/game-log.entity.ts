import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "../../../iam/user/entities/user.entity";
import { Game } from "./game.entity";
import { PlusScoreLog } from "./plus-score-log.entity";

@Entity()
export class GameLog {
  @PrimaryColumn("uuid")
  userId: string;

  @PrimaryColumn()
  gameId: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Game, { nullable: false })
  game: Game;

  @Column("int")
  score: number;

  @OneToMany(() => PlusScoreLog, (plusScoreLog) => plusScoreLog.gameLog, {
    nullable: false,
  })
  plusScoreLogs: PlusScoreLog[];

  @Column("int", { name: "time_played_seconds" })
  timePlayed: number;

  @Column("int", { name: "tried_times" })
  triedTimes: number;
}
