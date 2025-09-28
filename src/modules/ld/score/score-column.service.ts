import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CourseService } from "../course/course.service";
import { CreateScoreColDto } from "./dto/create-score-col.dto";
import { UpdateScoreColDto } from "./dto/update-score-col.dto";
import { ScoreColumn } from "./entities/score-column.entity";

@Injectable()
export class ScoreColumnService {
  constructor(
    @InjectRepository(ScoreColumn)
    private readonly scoreColumnRepository: Repository<ScoreColumn>,
    private readonly courseService: CourseService,
  ) {}

  async create(
    courseId: string,
    createScoreColDto: CreateScoreColDto,
  ): Promise<ScoreColumn> {
    const course = await this.courseService.findOne(courseId);

    const scoreColumn = this.scoreColumnRepository.create({
      ...createScoreColDto,
      isLocked: false,
      course,
    });
    return this.scoreColumnRepository.save(scoreColumn);
  }

  async findAll(
    courseId: string,
    summarize: boolean = false,
  ): Promise<ScoreColumn[]> {
    if (!summarize) {
      return this.scoreColumnRepository.find({
        where: {
          course: { id: courseId },
        },
      });
    }
    // Use query builder to fetch columns and their averages in one query
    // Use query builder to fetch columns and their averages in one query
    // The result will be: [{ id, name, coefficient, isLocked, average }]
    const qb = this.scoreColumnRepository
      .createQueryBuilder("score_column")
      .leftJoin("score_column.scores", "score")
      .select([
        "score_column.id AS id",
        "score_column.name AS name",
        "score_column.coefficient AS coefficient",
        "score_column.isLocked AS isLocked",
        "AVG(score.score) AS average",
      ])
      .where("score_column.courseId = :courseId", { courseId })
      .groupBy("score_column.id");

    // Return as array of objects with the selected fields
    const result = await qb.getRawMany();
    return result;
  }

  async findOne(id: number): Promise<ScoreColumn> {
    const scoreColumn = await this.scoreColumnRepository.findOne({
      where: { id },
      relations: ["scores"],
    });
    if (!scoreColumn) {
      throw new NotFoundException(`ScoreColumn with id ${id} not found`);
    }
    return scoreColumn;
  }

  async update(
    id: number,
    updateScoreColDto: UpdateScoreColDto,
  ): Promise<ScoreColumn> {
    await this.scoreColumnRepository.update(id, updateScoreColDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const scoreColumn = await this.findOne(id);
    scoreColumn.deletedAt = new Date();
    await this.scoreColumnRepository.save(scoreColumn);
  }
}
