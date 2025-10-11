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
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
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
  @ApiCreatedResponse({
    example: {
      id: 9,
      session: {
        id: 4,
        thumbnail: "https://example.com/thumbnail.jpg",
        title: "Introduction to Algebra",
        course: {
          id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
          title: "Introduction to Programming",
          code: "CS101",
        },
      },
      isSubmitted: false,
      createdAt: "2025-10-11T06:20:46.735Z",
      updatedAt: "2025-10-11T06:20:46.735Z",
    },
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
  @ApiCreatedResponse({
    example: {
      message: "Game has already been submitted",
      game: {
        id: 4,
        session: {
          id: 3,
          thumbnail: "https://example.com/thumbnail.png",
          title: "Lớp Đàn Chủ",
        },
        gameLogs: [
          {
            gameId: 4,
            user: {
              id: "367276c4-f513-4331-86fe-be31f488960c",
              fullName: "Johny Doe",
              internationalName: "J. Doe",
            },
            score: 100,
            plusScoreLogs: [
              {
                scoreColumn: {
                  id: 2,
                  name: "Ahihi",
                },
                score: 5,
              },
              {
                scoreColumn: {
                  id: 4,
                  name: "Ahaha",
                },
                score: 10,
              },
            ],
            timePlayed: 300,
            triedTimes: 2,
          },
        ],
        isSubmitted: true,
        createdAt: "2025-10-02T22:15:04.204Z",
        updatedAt: "2025-10-11T06:24:21.053Z",
      },
      scores: [],
    },
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.GAME_SUBMIT)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post(":id/submit")
  async submit(@Param("id", ParseIntPipe) id: number) {
    const game = await this.gameService.submit(id);
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
  @ApiOkResponse({
    example: [
      {
        id: 2,
        gameLogs: [
          {
            gameId: 2,
            score: 10,
            timePlayed: 300,
            triedTimes: 2,
          },
        ],
        isSubmitted: true,
        createdAt: "2025-09-28T09:11:50.901Z",
        updatedAt: "2025-10-02T22:32:16.565Z",
      },
      {
        id: 4,
        gameLogs: [
          {
            gameId: 4,
            score: 100,
            timePlayed: 300,
            triedTimes: 2,
          },
        ],
        isSubmitted: false,
        createdAt: "2025-10-02T22:15:04.204Z",
        updatedAt: "2025-10-02T22:15:04.204Z",
      },
    ],
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
  @ApiOkResponse({
    example: {
      id: 4,
      session: {
        id: 3,
        thumbnail: "https://example.com/thumbnail.png",
        title: "Lớp Đàn Chủ",
      },
      gameLogs: [
        {
          gameId: 4,
          user: {
            id: "367276c4-f513-4331-86fe-be31f488960c",
            fullName: "Johny Doe",
            internationalName: "J. Doe",
          },
          score: 100,
          plusScoreLogs: [
            {
              scoreColumn: {
                id: 2,
                name: "Ahihi",
              },
              score: 5,
            },
            {
              scoreColumn: {
                id: 4,
                name: "Ahaha",
              },
              score: 10,
            },
          ],
          timePlayed: 300,
          triedTimes: 2,
        },
      ],
      isSubmitted: true,
      createdAt: "2025-10-02T22:15:04.204Z",
      updatedAt: "2025-10-11T06:24:21.053Z",
    },
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
  @ApiCreatedResponse({
    example: {
      message: "Game logs created or updated successfully.",
    },
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
