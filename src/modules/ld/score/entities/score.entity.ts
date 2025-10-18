import { ReferenceUserDto } from "@/modules/iam/user/dto/reference-user.dto";
import { User } from "@/modules/iam/user/entities/user.entity";
import { Type } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PrimaryColumn } from "typeorm";

import { ScoreColumn } from "./score-column.entity";

@Entity()
export class Score {
  @PrimaryColumn("uuid")
  userId: string;

  @PrimaryColumn()
  scoreColumnId: number;

  @ManyToOne(() => User, { eager: true })
  @Type(() => ReferenceUserDto)
  user: User;

  @ManyToOne(() => ScoreColumn, (scoreColumn) => scoreColumn.scores)
  scoreColumn: ScoreColumn;

  @Column("float")
  score: number;
}
