import { plainToInstance } from "class-transformer";

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

import { AttendanceService } from "./attendace.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { MarkAttendanceDto } from "./dto/mark-attendance.dto";
import { SessionDto } from "./dto/session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Session } from "./entities/session.entity";
import { SessionService } from "./session.service";

@Controller()
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly attendanceService: AttendanceService,
  ) {}

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
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<SessionDto> {
    const session = await this.sessionService.findOne(id);
    return plainToInstance(SessionDto, session, {
      excludeExtraneousValues: true,
    });
    return session;
  }

  @Patch("session/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete("session/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sessionService.remove(id);
  }

  @Post("session/:id/attendance")
  async markAttendance(
    @Param("id", ParseIntPipe) id: number,
    @Body() markAttendanceDto: MarkAttendanceDto,
  ) {
    // Assumes user is authenticated and user id is available in req.user.id
    return this.attendanceService.markAttendance(id, markAttendanceDto);
  }

  @Get("session/:id/attendance")
  async getSessionAttendances(@Param("id", ParseIntPipe) id: number) {
    return this.attendanceService.getSessionAttendances(id);
  }

  @Delete("attendance/:id")
  async removeAttendance(@Param("id", ParseIntPipe) id: number) {
    await this.attendanceService.removeAttendance(id);
    return { message: "Attendance removed successfully" };
  }
}
