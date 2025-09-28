import { groupBy } from "@/common/group-by";
import { Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Score } from "../score/entities/score.entity";
import { ScoreService } from "../score/score.service";
import { SessionService } from "../session/session.service";
import { Game } from "./entities/game.entity";
import { PlusScoreLog } from "./entities/plus-score-log.entity";
import { PlusScoreLogService } from "./plus-score-log.service";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly sessionService: SessionService,
    private readonly plusScoreLogService: PlusScoreLogService,
    private readonly scoreService: ScoreService,
  ) {}

  async create(sessionId: number): Promise<Game> {
    const session = await this.sessionService.findOne(sessionId);
    const game = this.gameRepository.create({
      session,
      isSubmitted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.gameRepository.save(game);
  }

  async findAll(sessionId?: number): Promise<Game[]> {
    const where = sessionId ? { session: { id: sessionId } } : {};
    return this.gameRepository.find({
      where,
      relations: ["gameLogs"],
    });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ["session", "gameLogs"],
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    return game;
  }

  async remove(id: number): Promise<void> {
    const game = await this.findOne(id);
    game.deletedAt = new Date();
    await this.gameRepository.save(game);
  }

  async submit(
    id: number,
  ): Promise<{ message: string; game: Game; scores: Score[] }> {
    const game = await this.findOne(id);
    if (game.isSubmitted) {
      return {
        message: "Game has already been submitted",
        game,
        scores: [],
      };
    }

    const plusScoreLogs = await this.plusScoreLogService.findAll(id);
    const scores = await Promise.all(
      plusScoreLogs.map((psl) => {
        return this.scoreService.increase(
          psl.gameLogUserId,
          psl.scoreColumnId,
          psl.score,
        );
      }),
    );
    game.isSubmitted = true;
    game.updatedAt = new Date();
    await this.gameRepository.save(game);

    return {
      message: "Scores submitted to score table successfully",
      game,
      scores,
    };
  }
}
