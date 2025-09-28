import { Repository } from "typeorm";

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

  async findAll(courseId: string): Promise<ScoreColumn[]> {
    return this.scoreColumnRepository.find({
      where: {
        course: { id: courseId },
      },
    });
  }

  async findOne(id: number): Promise<ScoreColumn> {
    const scoreColumn = await this.scoreColumnRepository.findOne({
      where: { id },
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
