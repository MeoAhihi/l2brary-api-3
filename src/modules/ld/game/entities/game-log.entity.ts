import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../../../iam/user/entities/user.entity";
import { Game } from "./game.entity";

@Entity()
export class GameLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column("int")
  score: number;

  @Column("int", { name: "time_played_seconds" })
  timePlayed: number;

  @Column("int", { name: "tried_times" })
  triedTimes: number;

  @ManyToOne(() => Game, { nullable: false })
  game: Game;
}
