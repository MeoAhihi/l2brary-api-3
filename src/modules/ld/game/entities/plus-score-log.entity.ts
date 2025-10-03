import { ScoreColumn } from "@/modules/ld/score/entities/score-column.entity";
import { Exclude, Expose, Type } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { ReferenceScoreColumnDto } from "../../score/dto/reference-score-column.dto";
import { GameLog } from "./game-log.entity";

/**
 * Entity representing a log of additional ("plus") scores awarded to a user in a game,
 * associated with a specific score column (e.g., bonus, participation, etc).
 */
@Entity()
export class PlusScoreLog {
  @PrimaryColumn("uuid")
  @Exclude()
  gameLogUserId: string;

  @PrimaryColumn()
  @Exclude()
  gameLogGameId: number;

  @PrimaryColumn()
  @Exclude()
  scoreColumnId: number;

  @ManyToOne(() => GameLog, (gameLog) => gameLog.plusScoreLogs, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @Type(() => GameLog)
  @Expose()
  gameLog: GameLog;

  @ManyToOne(() => ScoreColumn, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @Type(() => ReferenceScoreColumnDto)
  @Expose()
  scoreColumn: ScoreColumn;

  @Column({ type: "int" })
  @Expose()
  score: number;
}
