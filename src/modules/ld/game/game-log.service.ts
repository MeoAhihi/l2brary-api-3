import { UserService } from "@/modules/iam/user/user.service";
import { Repository } from "typeorm";

import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateGameLogDto } from "./dto/create-game-log.dto";
import { GameLog } from "./entities/game-log.entity";
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

  async upsertBulk(gameId: number, createGameLogDtos: CreateGameLogDto[]) {
    const game = await this.gameService.findOne(gameId);

    // Check for duplicate userId in createGameLogDtos
    const userIds = createGameLogDtos.map((dto) => dto.userId);
    const uniqueUserIds = new Set(userIds);
    if (uniqueUserIds.size !== userIds.length) {
      throw new ConflictException("Duplicate userId found.");
    }

    const data: GameLog[] = await Promise.all(
      createGameLogDtos.map(
        async ({
          score,
          timePlayed,
          triedTimes,
          userId,
          plusScores = [],
        }) => {
          // Upsert plus score logs for this user/game if any plusScoreDtos are provided
          const plusScoreLogs = await this.plusScoreLogService.upsertBulk(
            userId,
            gameId,
            plusScores,
          );
          return {
            gameId,
            game,
            userId,
            user: await this.userService.findOne(userId),
            score,
            timePlayed,
            triedTimes,
            plusScoreLogs,
          };
        },
      ),
    );
    await this.gameLogRepository.upsert(data, ["user", "game"] as const);

    return { message: "Game logs created successfully." };
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
