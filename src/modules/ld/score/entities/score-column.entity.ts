import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Course } from "../../course/entities/course.entity";
import { Score } from "./score.entity";

@Entity()
export class ScoreColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("int")
  coefficient: number;

  @Column({ default: false })
  isLocked: boolean;

  @ManyToMany(() => Course, (course) => course.scoreColumns)
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Score, (score) => score.scoreColumn, { cascade: true })
  scores: Score[];
}
