import { getMissing } from "@/common/compare-arrays";
import { User } from "@/modules/iam/user/entities/user.entity";
import { UserService } from "@/modules/iam/user/user.service";
import { In, Repository } from "typeorm";

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ScoreDto } from "./dto/score.dto";
import { Score } from "./entities/score.entity";
import { ScoreColumnService } from "./score-column.service";

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    private readonly scoreColumnService: ScoreColumnService,
    private readonly userService: UserService,
  ) {}

  async upsert(scoreColumnId: number, scoreDtos: ScoreDto[]) {
    const scoreColumn = await this.scoreColumnService.findOne(scoreColumnId);

    // Prepare data for upsert
    const data = await Promise.all(
      scoreDtos.map(async (dto) => ({
        user: await this.userService.findOne(dto.userId),
        score: dto.score,
        scoreColumn,
      })),
    );

    // Upsert scores based on userId and scoreColumn
    await this.scoreRepository.upsert(data, ["user", "scoreColumn"]);
  }

  private async getScoresByColumns(scoreColumnIds: number[]) {
    if (!scoreColumnIds.length) return [];
    return this.scoreRepository.find({
      where: {
        scoreColumn: { id: In(scoreColumnIds) },
      },
      relations: ["scoreColumn", "user"],
    });
  }

  private buildUserScoreMap(
    scores: Score[],
  ): { user: User; scores: Score[] }[] {
    const userScores: { user: User; scores: Score[] }[] = [];
    for (const score of scores) {
      const userId = score.user.id;
      if (!userScores[userId]) {
        userScores[userId] = { user: score.user, scores: [] };
      }
      userScores[userId].scores.push(score);
    }
    return Object.values(userScores);
  }

  private toScoreTable(userScores: { user: User; scores: Score[] }[]): {
    user: User;
    scores: Score[];
    average: number;
  }[] {
    return userScores.map(({ user, scores }) => {
      const scoreValues = scores.map((s) => s.score);
      const average =
        scoreValues.length > 0
          ? // Account for coefficient in average calculation
            (() => {
              // Each score in 'scores' has a 'score' and a 'scoreColumn' with 'coefficient'
              // If coefficient is undefined, treat as 1
              const weightedSum = scores.reduce(
                (sum, s) => sum + s.score * (s.scoreColumn?.coefficient ?? 1),
                0,
              );
              const totalCoeff = scores.reduce(
                (sum, s) => sum + (s.scoreColumn?.coefficient ?? 1),
                0,
              );
              return totalCoeff > 0 ? weightedSum / totalCoeff : 0;
            })()
          : 0;
      return {
        user,
        scores,
        average,
      };
    });
  }

  /**
   * Retrieves a table of user scores for the specified score column IDs.
   *
   * @param scoreColumnIds - An array of score column IDs to include in the table.
   * @returns An array of objects, each representing a user with their scores for the given columns and their average score.
   *
   * Each returned object has the following structure:
   *   {
   *     user: number,         // The user ID
   *     scores: number[],     // Scores for each column in the order of scoreColumnIds
   *     average: number       // The average score across the columns
   *   }
   *
   * If no scoreColumnIds are provided, returns an empty array.
   */
  async getScoreTable(
    courseId: string,
  ): Promise<{ user: User; scores: Score[]; average: number }[]> {
    const scoreColumn = await this.scoreColumnService.findAll(courseId);
    const scoreColumnIds = scoreColumn.map((sc) => sc.id);

    const scores = await this.getScoresByColumns(scoreColumnIds);
    const userScores = this.buildUserScoreMap(scores);
    const result = this.toScoreTable(userScores);
    return result;
  }
}
