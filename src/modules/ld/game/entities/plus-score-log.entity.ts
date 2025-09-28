import { ScoreColumn } from "@/modules/ld/score/entities/score-column.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { GameLog } from "./game-log.entity";

/**
 * Entity representing a log of additional ("plus") scores awarded to a user in a game,
 * associated with a specific score column (e.g., bonus, participation, etc).
 */
@Entity()
export class PlusScoreLog {
  @PrimaryColumn("uuid")
  gameLogUserId: string;

  @PrimaryColumn()
  gameLogGameId: number;

  @PrimaryColumn()
  scoreColumnId: number;

  @ManyToOne(() => GameLog, (gameLog) => gameLog.plusScoreLogs, {
    nullable: false,
    onDelete: "CASCADE",
  })
  gameLog: GameLog;

  @ManyToOne(() => ScoreColumn, {
    nullable: false,
    onDelete: "CASCADE",
  })
  scoreColumn: ScoreColumn;

  @Column({ type: "int" })
  score: number;
}
