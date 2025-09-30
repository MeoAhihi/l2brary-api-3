import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

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

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.SESSION_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post("course/:courseId/session")
  create(
    @Param("courseId") courseId: string,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.sessionService.create(courseId, createSessionDto);
  }

  /* Intentional No Guard */
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

  /* Intentional No Guard */
  @Get("session/:id")
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<SessionDto> {
    return await this.sessionService.findOne(id);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.SESSION_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch("session/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.SESSION_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete("session/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sessionService.remove(id);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.SESSION_ATTENDANCE_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post("session/:id/attendance")
  async markAttendance(
    @Param("id", ParseIntPipe) id: number,
    @Body() markAttendanceDto: MarkAttendanceDto,
  ) {
    // Assumes user is authenticated and user id is available in req.user.id
    return this.attendanceService.markAttendance(id, markAttendanceDto);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get("session/:id/attendance")
  async getSessionAttendances(@Param("id", ParseIntPipe) id: number) {
    return this.attendanceService.getSessionAttendances(id);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ATTENDANCE_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete("attendance/:id")
  async removeAttendance(@Param("id", ParseIntPipe) id: number) {
    await this.attendanceService.removeAttendance(id);
    return { message: "Attendance removed successfully" };
  }
}
