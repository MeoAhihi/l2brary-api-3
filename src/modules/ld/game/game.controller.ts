import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";
import { plainToInstance } from "class-transformer";

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

import { CreateGameLogDto } from "./dto/create-game-log.dto";
import { Game } from "./entities/game.entity";
import { GameLogService } from "./game-log.service";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly gameLogService: GameLogService,
  ) {}

  @ApiOperation({
    summary: "Create game",
    description: "Create a new game for a session. Requires admin permissions.",
    tags: ["Game Management"],
  })
  // Create a new game for a given sessionId
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.GAME_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @ApiQuery({
    name: "sessionId",
    type: "string",
    required: true,
    description: "The ID of the session to create a game for",
  })
  @Post()
  async create(@Query("sessionId") sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException("sessionId query parameter is required");
    }
    const game = await this.gameService.create(+sessionId);
    return plainToInstance(Game, game, { excludeExtraneousValues: true });
  }

  @ApiOperation({
    summary: "Submit game",
    description: "Submit a game for scoring. Requires JWT authentication.",
    tags: ["Game Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.GAME_SUBMIT)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post(":id/submit")
  async submit(@Param("id", ParseIntPipe) id: number) {
    const game = await this.gameService.submit(id);
    console.log("🚀 ~ GameController ~ submit ~ game:", game.game.gameLogs);
    game.game = plainToInstance(Game, game.game, {
      excludeExtraneousValues: true,
    });
    return game;
  }

  @ApiOperation({
    summary: "Get all games",
    description:
      "Retrieve all games with optional session filtering. No authentication required.",
    tags: ["Game Management"],
  })
  /* Intentional No Guard */
  @Get()
  @ApiQuery({
    name: "sessionId",
    type: "string",
    required: false,
    description: "Optional session id to filter games by session",
  })
  async findAll(@Query("sessionId") sessionId?: string) {
    const games = await this.gameService.findAll(
      sessionId ? +sessionId : undefined,
    );
    return plainToInstance(Game, games, { excludeExtraneousValues: true });
  }

  @ApiOperation({
    summary: "Get game by ID",
    description:
      "Retrieve a specific game by its ID. No authentication required.",
    tags: ["Game Management"],
  })
  /* Intentional No Guard */
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const game = await this.gameService.findOne(+id);
    return plainToInstance(Game, game, { excludeExtraneousValues: true });
  }

  @ApiOperation({
    summary: "Delete game",
    description: "Delete a game. Requires admin permissions.",
    tags: ["Game Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.GAME_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.gameService.remove(+id);
  }

  @ApiOperation({
    summary: "Log game activity",
    description: "Log game activity and progress. Requires JWT authentication.",
    tags: ["Game Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.GAME_LOG)
  @UseGuards(JwtAuthGuard, PermissionGuard)
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
