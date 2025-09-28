import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiQuery } from "@nestjs/swagger";

import { CreateGameLogDto } from "./dto/create-game-log.dto";
import { GameLogService } from "./game-log.service";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly gameLogService: GameLogService,
  ) {}

  // Create a new game for a given sessionId
  @Post()
  @ApiQuery({
    name: "sessionId",
    type: "string",
    required: true,
    description: "The ID of the session to create a game for",
  })
  create(@Query("sessionId") sessionId: string) {
    if (!sessionId) {
      throw new Error("sessionId query parameter is required");
    }
    return this.gameService.create(+sessionId);
  }

  // Get all games, optionally filter by sessionId
  @Get()
  @ApiQuery({
    name: "sessionId",
    type: "string",
    required: false,
    description: "Optional session id to filter games by session",
  })
  findAll(@Query("sessionId") sessionId?: string) {
    return this.gameService.findAll(sessionId ? +sessionId : undefined);
  }

  // Get a single game by id
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.gameService.findOne(+id);
  }

  // Soft-delete a game by id
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.gameService.remove(+id);
  }

  // Bulk upsert game logs for a game
  @Post(":id/logs")
  @ApiBody({
    type: CreateGameLogDto,
    isArray: true,
  })
  async upsertGameLogs(
    @Param("id") id: string,
    @Body() createGameLogDtos: CreateGameLogDto[],
  ) {
    return this.gameLogService.upsertBulk(+id, createGameLogDtos);
  }
}
