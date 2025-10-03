import { In, Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { PlusScoreLog } from "./entities/plus-score-log.entity";

@Injectable()
export class PlusScoreLogService {
  constructor(
    @InjectRepository(PlusScoreLog)
    private readonly plusScoreLogRepository: Repository<PlusScoreLog>,
  ) {}

  async findOne(
    gameLogUserId: string,
    gameLogGameId: number,
    scoreColumnId: number,
  ) {
    const plusScoreLog = await this.plusScoreLogRepository.findOne({
      where: {
        gameLogUserId,
        gameLogGameId,
        scoreColumnId,
      },
    });
    if (!plusScoreLog) {
      throw new NotFoundException("PlusScoreLog not found");
    }
    return plusScoreLog;
  }

  async findAll(gameId?: number) {
    const where = gameId ? { gameLogGameId: gameId } : {};
    return this.plusScoreLogRepository.find({
      where,
    });
  }

  async upsert(
    gameLogUserId: string,
    gameLogGameId: number,
    scoreColumnId: number,
    score: number,
  ) {
    await this.plusScoreLogRepository.upsert(
      {
        gameLogUserId,
        gameLogGameId,
        scoreColumnId,
        score,
      },
      ["gameLogUserId", "gameLogGameId", "scoreColumnId"],
    );
    return this.findOne(gameLogUserId, gameLogGameId, scoreColumnId);
  }

  async upsertBulk(
    gameLogUserId: string,
    gameLogGameId: number,
    plusScoreDtos: { scoreColumnId: number; score: number }[],
  ) {
    if (!plusScoreDtos || plusScoreDtos.length === 0) {
      return [];
    }

    const entities = plusScoreDtos.map(({ scoreColumnId, score }) => {
      
      return {
        gameLogUserId,
        gameLogGameId,
        scoreColumnId,
        score,
      };
    });

    await this.plusScoreLogRepository.upsert(entities, [
      "gameLogUserId",
      "gameLogGameId",
      "scoreColumnId",
    ]);

    // Return the upserted logs
    return this.plusScoreLogRepository.find({
      where: {
        gameLogUserId,
        gameLogGameId,
        scoreColumnId: In(plusScoreDtos.map((dto) => dto.scoreColumnId)),
      },
    });
  }
}
