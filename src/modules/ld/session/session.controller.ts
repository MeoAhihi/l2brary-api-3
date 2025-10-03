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
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery } from "@nestjs/swagger";

import { AttendanceService } from "./attendace.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { MarkAttendanceDto } from "./dto/mark-attendance.dto";
import { SessionDto } from "./dto/session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Attendance } from "./entities/attendance.entity";
import { SessionService } from "./session.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly attendanceService: AttendanceService,
  ) {}

  @ApiOperation({
    summary: "Create session",
    description:
      "Create a new session for a course. Requires admin permissions.",
    tags: ["Session Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.SESSION_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post("course/:courseId/session")
  async create(
    @Param("courseId") courseId: string,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    const session = await this.sessionService.create(
      courseId,
      createSessionDto,
    );
    return plainToInstance(SessionDto, session, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Get course sessions",
    description:
      "Retrieve all sessions for a specific course. No authentication required.",
    tags: ["Session Management"],
  })
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
  async findAll(
    @Param("courseId") courseId: string,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ): Promise<{
    data: SessionDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { data, total, totalPages } = await this.sessionService.findAll({
      courseId,
      page: page,
      limit: limit,
    });
    return {
      data: plainToInstance(SessionDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @ApiOperation({
    summary: "Get session by ID",
    description:
      "Retrieve a specific session by its ID. No authentication required.",
    tags: ["Session Management"],
  })
  /* Intentional No Guard */
  @Get("session/:id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<SessionDto> {
    const session = await this.sessionService.findOne(id);
    return plainToInstance(SessionDto, session, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Update session",
    description: "Update an existing session. Requires admin permissions.",
    tags: ["Session Management"],
  })
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

  @ApiOperation({
    summary: "Delete session",
    description: "Delete a session. Requires admin permissions.",
    tags: ["Session Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.SESSION_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete("session/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sessionService.remove(id);
  }

  @ApiOperation({
    summary: "Mark attendance",
    description: "Mark attendance for a session. Requires JWT authentication.",
    tags: ["Session Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.SESSION_ATTENDANCE_CREATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post("session/:id/attendance")
  async markAttendance(
    @Param("id", ParseIntPipe) id: number,
    @Body() markAttendanceDto: MarkAttendanceDto,
  ): Promise<Attendance[]> {
    // Assumes user is authenticated and user id is available in req.user.id
    const attendances = await this.attendanceService.markAttendance(
      id,
      markAttendanceDto,
    );
    return plainToInstance(Attendance, attendances, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Get session attendance",
    description:
      "Retrieve attendance records for a session. Requires admin permissions.",
    tags: ["Session Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.COURSE_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get("session/:id/attendance")
  async getSessionAttendances(@Param("id", ParseIntPipe) id: number) {
    const attendances = await this.attendanceService.getSessionAttendances(id);
    return plainToInstance(Attendance, attendances, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: "Delete attendance",
    description: "Delete an attendance record. Requires admin permissions.",
    tags: ["Session Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ATTENDANCE_DELETE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete("attendance/:id")
  async removeAttendance(@Param("id", ParseIntPipe) id: number) {
    await this.attendanceService.removeAttendance(id);
    return { message: "Attendance removed successfully" };
  }
}
