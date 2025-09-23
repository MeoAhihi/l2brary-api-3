import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { SessionService } from "./session.service";
import { Session } from "./entities/session.entity";

@Controller()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post("course/:courseId/session")
  create(
    @Param("courseId") courseId: string,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.sessionService.create(courseId, createSessionDto);
  }

  @Get("course/:courseId/session")
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number for pagination (optional)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of items per page for pagination (optional)",
  })
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @Param("courseId") courseId: string,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ): Promise<{
    data: Session[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.sessionService.findAll({
      courseId,
      page: page,
      limit: limit,
    });
  }

  @Get("session/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.sessionService.findOne(id);
  }

  @Patch("session/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete("session/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sessionService.remove(id);
  }
}
