import { User } from "@/modules/iam/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PrimaryColumn } from "typeorm";

import { ScoreColumn } from "./score-column.entity";
import { ReferenceUserDto } from "@/modules/iam/user/dto/reference-user.dto";

@Entity()
export class Score {
  @PrimaryColumn("uuid")
  userId: string;

  @PrimaryColumn()
  scoreColumnId: number;

  @ManyToOne(() => ReferenceUserDto, { eager: true })
  user: User;

  @ManyToOne(() => ScoreColumn, (scoreColumn) => scoreColumn.scores)
  scoreColumn: ScoreColumn;

  @Column("float")
  score: number;
}
