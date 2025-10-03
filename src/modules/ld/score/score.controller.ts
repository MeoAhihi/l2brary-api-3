import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";
import { plainToInstance } from "class-transformer";

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { CreateScoreColDto } from "./dto/create-score-col.dto";
import { ScoreTableDto } from "./dto/score-table.dto";
import { ScoreDto } from "./dto/score.dto";
import { UpdateScoreColDto } from "./dto/update-score-col.dto";
import { ScoreColumn } from "./entities/score-column.entity";
import { ScoreColumnService } from "./score-column.service";
import { ScoreService } from "./score.service";

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("score")
@ApiTags("Score")
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly scoreColumnService: ScoreColumnService,
  ) {}

  // Score Column endpoints
  @ApiOperation({
    summary: "Create score column",
    description:
      "Create a new score column for a course. Requires admin permissions.",
    tags: ["Score Management"],
  })
  @RequirePermission(PermissionEnum.SCORE_COLUMN_CREATE)
  @Post("column/:courseId")
  @ApiParam({ name: "courseId", type: String, description: "ID of the course" })
  @ApiResponse({ status: 201, description: "Score column created" })
  async createScoreColumn(
    @Param("courseId") courseId: string,
    @Body() createScoreColDto: CreateScoreColDto,
  ): Promise<ScoreColumn> {
    const scoreColumn = await this.scoreColumnService.create(
      courseId,
      createScoreColDto,
    );
    return plainToInstance(ScoreColumn, scoreColumn, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Get score columns",
    description:
      "Retrieve all score columns for a course. Requires admin permissions.",
    tags: ["Score Management"],
  })
  @RequirePermission(PermissionEnum.SCORE_COLUMN_READ_ALL)
  @Get("column/:courseId")
  @ApiParam({ name: "courseId", type: String, description: "ID of the course" })
  @ApiQuery({
    name: "summarize",
    type: Boolean,
    required: false,
    description: "If true, returns only summary info for each column",
  })
  @ApiResponse({ status: 200, description: "List of score columns" })
  async getScoreColumns(
    @Param("courseId") courseId: string,
    @Query("summarize") summarize: boolean = false,
  ) {
    return this.scoreColumnService.findAll(courseId, summarize);
  }

  @ApiOperation({
    summary: "Get score column details",
    description:
      "Retrieve detailed information about a score column. Requires admin permissions.",
    tags: ["Score Management"],
  })
  @RequirePermission(PermissionEnum.SCORE_COLUMN_READ_ONE)
  @Get("column/detail/:id")
  @ApiParam({ name: "id", type: Number, description: "ID of the score column" })
  @ApiResponse({ status: 200, description: "Score column details" })
  async getScoreColumn(@Param("id") id: number) {
    const scoreColumn = await this.scoreColumnService.findOne(id);
    return plainToInstance(ScoreColumn, scoreColumn, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Update score column",
    description: "Update an existing score column. Requires admin permissions.",
    tags: ["Score Management"],
  })
  @RequirePermission(PermissionEnum.SCORE_COLUMN_UPDATE)
  @Patch("column/:id")
  @ApiParam({ name: "id", type: Number, description: "ID of the score column" })
  @ApiResponse({ status: 200, description: "Score column updated" })
  async updateScoreColumn(
    @Param("id") id: number,
    @Body() updateScoreColDto: UpdateScoreColDto,
  ) {
    const updatedScoreColumn = await this.scoreColumnService.update(
      id,
      updateScoreColDto,
    );
    return plainToInstance(ScoreColumn, updatedScoreColumn, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Delete score column",
    description: "Delete a score column. Requires admin permissions.",
    tags: ["Score Management"],
  })
  @RequirePermission(PermissionEnum.SCORE_COLUMN_DELETE)
  @Delete("column/:id")
  @ApiParam({ name: "id", type: Number, description: "ID of the score column" })
  @ApiResponse({ status: 200, description: "Score column deleted" })
  async deleteScoreColumn(@Param("id") id: number) {
    return this.scoreColumnService.remove(id);
  }

  // Score endpoints
  @ApiOperation({
    summary: "Upsert scores",
    description:
      "Create or update scores for a score column. Requires JWT authentication.",
    tags: ["Score Management"],
  })
  @RequirePermission(PermissionEnum.SCORE_UPSERT)
  @Post()
  @ApiQuery({
    name: "scoreColumnId",
    type: Number,
    required: true,
    description: "ID of the score column",
  })
  @ApiBody({
    type: ScoreDto,
    isArray: true,
  })
  @ApiResponse({ status: 201, description: "Scores upserted" })
  async upsertScores(
    @Query("scoreColumnId") scoreColumnId: number,
    @Body() scores: ScoreDto[],
  ) {
    await this.scoreService.upsertBulkByScoreColumn(scoreColumnId, scores);
    return { message: "Scores upserted successfully." };
  }

  @ApiOperation({
    summary: "Get score table",
    description:
      "Retrieve score table data for a course. Requires admin permissions.",
    tags: ["Score Management"],
  })
  @RequirePermission(PermissionEnum.SCORE_TABLE_READ)
  @Get("table")
  @ApiQuery({
    name: "courseId",
    type: String,
    required: true,
    description: "ID of the course",
  })
  async getScoreTable(
    @Query("courseId") courseId: string,
  ): Promise<ScoreTableDto[]> {
    const tableData = await this.scoreService.getScoreTable(courseId);
    return plainToInstance(ScoreTableDto, tableData, {
      excludeExtraneousValues: true,
    });
  }
}
