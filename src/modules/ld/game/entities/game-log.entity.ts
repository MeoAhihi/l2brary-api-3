import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "../../../iam/user/entities/user.entity";
import { Game } from "./game.entity";

@Entity()
export class GameLog {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  gameId: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Game, { nullable: false })
  game: Game;

  @Column("int")
  score: number;

  @Column("int", { name: "time_played_seconds" })
  timePlayed: number;

  @Column("int", { name: "tried_times" })
  triedTimes: number;
}
