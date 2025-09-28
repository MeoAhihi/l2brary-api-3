import { plainToInstance } from "class-transformer";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { CreateScoreColDto } from "./dto/create-score-col.dto";
import { ScoreDto } from "./dto/score.dto";
import { ScoreTableDto } from "./dto/score-table.dto";
import { UpdateScoreColDto } from "./dto/update-score-col.dto";
import { ScoreColumnService } from "./score-column.service";
import { ScoreService } from "./score.service";

@Controller("score")
@ApiTags("Score")
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly scoreColumnService: ScoreColumnService,
  ) {}

  // Score Column endpoints

  @Post("column/:courseId")
  @ApiOperation({ summary: "Create a new score column for a course" })
  @ApiParam({ name: "courseId", type: String, description: "ID of the course" })
  @ApiResponse({ status: 201, description: "Score column created" })
  async createScoreColumn(
    @Param("courseId") courseId: string,
    @Body() createScoreColDto: CreateScoreColDto,
  ) {
    return this.scoreColumnService.create(courseId, createScoreColDto);
  }

  @Get("column/:courseId")
  @ApiOperation({ summary: "Get all score columns for a course" })
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

  @Get("column/detail/:id")
  @ApiOperation({ summary: "Get details of a score column" })
  @ApiParam({ name: "id", type: Number, description: "ID of the score column" })
  @ApiResponse({ status: 200, description: "Score column details" })
  async getScoreColumn(@Param("id") id: number) {
    return this.scoreColumnService.findOne(id);
  }

  @Patch("column/:id")
  @ApiOperation({ summary: "Update a score column" })
  @ApiParam({ name: "id", type: Number, description: "ID of the score column" })
  @ApiResponse({ status: 200, description: "Score column updated" })
  async updateScoreColumn(
    @Param("id") id: number,
    @Body() updateScoreColDto: UpdateScoreColDto,
  ) {
    return this.scoreColumnService.update(id, updateScoreColDto);
  }

  @Delete("column/:id")
  @ApiOperation({ summary: "Delete a score column" })
  @ApiParam({ name: "id", type: Number, description: "ID of the score column" })
  @ApiResponse({ status: 200, description: "Score column deleted" })
  async deleteScoreColumn(@Param("id") id: number) {
    return this.scoreColumnService.remove(id);
  }

  // Score endpoints

  @Post()
  @ApiOperation({ summary: "Upsert scores for a score column" })
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
    @Body("scores") scores: ScoreDto[],
  ) {
    return this.scoreService.upsert(scoreColumnId, scores);
  }

  @Get("table")
  @ApiOperation({ summary: "Get score table for given score column IDs" })
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
