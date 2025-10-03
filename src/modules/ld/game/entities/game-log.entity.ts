import { ReferenceUserDto } from "@/modules/iam/user/dto/reference-user.dto";
import { Exclude, Expose, Type } from "class-transformer";
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
  @Exclude()
  userId: string;

  @PrimaryColumn()
  @Expose()
  gameId: number;

  @ManyToOne(() => User, { nullable: false })
  @Type(() => ReferenceUserDto)
  @Expose()
  user: User;

  @ManyToOne(() => Game, { nullable: false })
  @Expose()
  game: Game;

  @Column("int")
  @Expose()
  score: number;

  @OneToMany(() => PlusScoreLog, (plusScoreLog) => plusScoreLog.gameLog, {
    nullable: false,
  })
  @Type(() => PlusScoreLog)
  @Expose()
  plusScoreLogs: PlusScoreLog[];

  @Column("int", { name: "time_played_seconds" })
  @Expose()
  timePlayed: number;

  @Column("int", { name: "tried_times" })
  @Expose()
  triedTimes: number;
}
