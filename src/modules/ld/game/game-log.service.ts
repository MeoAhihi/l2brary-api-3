import { UserService } from "@/modules/iam/user/user.service";
import { Repository } from "typeorm";

import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateGameLogDto } from "./dto/create-game-log.dto";
import { GameLog } from "./entities/game-log.entity";
import { Game } from "./entities/game.entity";
import { GameService } from "./game.service";
import { PlusScoreLogService } from "./plus-score-log.service";

@Injectable()
export class GameLogService {
  constructor(
    @InjectRepository(GameLog)
    private readonly gameLogRepository: Repository<GameLog>,
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly plusScoreLogService: PlusScoreLogService,
  ) {}

  async upsert(game: Game, createGameLogDto: CreateGameLogDto) {
    const {
      score,
      timePlayed,
      triedTimes,
      userId,
      plusScores = [],
    } = createGameLogDto;

    const user = await this.userService.findOne(userId);

    const data: GameLog = {
      gameId: game.id,
      game,
      userId,
      user,
      score,
      timePlayed,
      triedTimes,
      plusScoreLogs: [], // Will be updated after plusScoreLogs upsert
    };

    // Upsert the game log first
    await this.gameLogRepository.upsert(data, ["user", "game"] as const);

    // Upsert plus score logs for this user/game if any plusScoreDtos are provided
    await this.plusScoreLogService.upsertBulk(userId, game.id, plusScores);

    // Optionally, you could update the game log with the plusScoreLogs if needed
    return { message: "Game log created or updated successfully." };
  }

  async upsertBulk(gameId: number, createGameLogDtos: CreateGameLogDto[]) {
    const game = await this.gameService.findOne(gameId);
    if (game.isSubmitted)
      throw new ForbiddenException(
        "Game already submitted. You cannot modify game logs.",
      );

    // Check for duplicate userId in createGameLogDtos
    const userIds = createGameLogDtos.map((dto) => dto.userId);
    const uniqueUserIds = new Set(userIds);
    if (uniqueUserIds.size !== userIds.length) {
      throw new ConflictException("Duplicate userId found.");
    }

    await Promise.all(createGameLogDtos.map((dto) => this.upsert(game, dto)));

    return { message: "Game logs created or updated successfully." };
  }

  async findOne(gameId: number, userId: string) {
    return this.gameLogRepository.findOne({
      where: {
        game: { id: gameId },
        user: { id: userId },
      },
    });
  }
}
