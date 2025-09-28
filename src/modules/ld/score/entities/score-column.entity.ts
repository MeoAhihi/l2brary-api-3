import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Course } from "../../course/entities/course.entity";
import { Score } from "./score.entity";

@Entity()
export class ScoreColumn {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column("int", { default: 1 })
  coefficient: number;

  @Column({ default: false })
  isLocked: boolean;

  @ManyToOne(() => Course, (course) => course.scoreColumns)
  course: Course;

  @OneToMany(() => Score, (score) => score.scoreColumn, { cascade: true })
  scores: Score[];

  @DeleteDateColumn()
  deletedAt: Date;
}
