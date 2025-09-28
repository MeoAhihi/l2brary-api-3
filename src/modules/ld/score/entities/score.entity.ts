import { User } from "@/modules/iam/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ScoreColumn } from "./score-column.entity";

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => ScoreColumn, (scoreColumn) => scoreColumn.scores)
  scoreColumn: ScoreColumn;

  @Column("float")
  score: number;
}
