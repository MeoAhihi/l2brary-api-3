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
import { ApiBearerAuth, ApiBody, ApiQuery } from "@nestjs/swagger";

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

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.GAME_SUBMIT)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post(":id/submit")
  async submit(@Param("id", ParseIntPipe) id: number) {
    return this.gameService.submit(id);
  }

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

  /* Intentional No Guard */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.gameService.findOne(+id);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.GAME_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.gameService.remove(+id);
  }

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
