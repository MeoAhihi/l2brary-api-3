import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import {
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
import { ApiBearerAuth, ApiBody, ApiQuery , ApiOperation } from "@nestjs/swagger";

import { CreateGameLogDto } from "./dto/create-game-log.dto";
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
    tags: ["Game Management"]
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
  create(@Query("sessionId") sessionId: string) {
    if (!sessionId) {
      throw new Error("sessionId query parameter is required");
    }
    return this.gameService.create(+sessionId);
  }

  @ApiOperation({ 
    summary: "Submit game", 
    description: "Submit a game for scoring. Requires JWT authentication.",
    tags: ["Game Management"]
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.GAME_SUBMIT)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post(":id/submit")
  async submit(@Param("id", ParseIntPipe) id: number) {
    return this.gameService.submit(id);
  }

  @ApiOperation({ 
    summary: "Get all games", 
    description: "Retrieve all games with optional session filtering. No authentication required.",
    tags: ["Game Management"]
  })
  /* Intentional No Guard */
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

  @ApiOperation({ 
    summary: "Get game by ID", 
    description: "Retrieve a specific game by its ID. No authentication required.",
    tags: ["Game Management"]
  })
  /* Intentional No Guard */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.gameService.findOne(+id);
  }

  @ApiOperation({ 
    summary: "Delete game", 
    description: "Delete a game. Requires admin permissions.",
    tags: ["Game Management"]
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
    tags: ["Game Management"]
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
