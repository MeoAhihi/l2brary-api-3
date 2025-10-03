import { Exclude, Expose, Type } from "class-transformer";
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ReferenceCourseDto } from "../../course/dto/reference-course.dto";
import { Course } from "../../course/entities/course.entity";
import { Score } from "./score.entity";

@Entity()
export class ScoreColumn {
  @Expose()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column("int", { default: 1 })
  coefficient: number;

  @Expose()
  @Column({ default: false })
  isLocked: boolean;

  @Expose()
  @Type(() => ReferenceCourseDto)
  @ManyToOne(() => Course, (course) => course.scoreColumns)
  course: Course;

  @Exclude()
  @OneToMany(() => Score, (score) => score.scoreColumn, { cascade: true })
  scores: Score[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
