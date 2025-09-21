import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { SessionService } from "./session.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { ApiQuery } from "@nestjs/swagger";

@Controller()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post("course/:courseId/session")
  create(
    @Param("courseId") courseId: string,
    @Body() createSessionDto: CreateSessionDto
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
  findAll(
    @Param("courseId") courseId: string,
    @Query("page") page: number,
    @Query("limit") limit: number
  ) {
    // Accepts optional pagination via body (or could be query, but keeping as body for now)
    return this.sessionService.findAll({
      courseId,
      page: page,
      limit: limit,
    });
  }

  @Get("session/:id")
  findOne(@Param("id") id: string) {
    return this.sessionService.findOne(+id);
  }

  @Patch("session/:id")
  update(@Param("id") id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(+id, updateSessionDto);
  }

  @Delete("session/:id")
  remove(@Param("id") id: string) {
    return this.sessionService.remove(+id);
  }
}
