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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

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
  @ApiCreatedResponse({
    example: {
      id: 4,
      thumbnail: "https://example.com/thumbnail.jpg",
      title: "Introduction to Algebra",
      course: {
        id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
        title: "Introduction to Programming",
        code: "CS101",
        description: "Learn the basics of programming using Python.",
      },
      description: "This session will cover the basics of algebra.",
      startTime: "2024-06-01T10:00:00.000Z",
      endTime: "2024-06-01T12:00:00.000Z",
      presenterName: "Dr. Jane Doe",
      locationType: "online",
      roomInfo: "Room 101, Main Building",
      address: "123 Main St, Springfield",
      maxParticipant: 50,
      lateThreshold: 10,
      autoCheckIn: true,
      allowLateJoin: true,
      enableGame: true,
      autoScoring: true,
      maxGamePerSession: 3,
      gameTimeout: 60,
      emailNotification: true,
      smsNotification: true,
      reminderNotification: true,
      updatedAt: "2025-10-11T05:51:42.595Z",
      status: "completed",
      checked: 0,
      totalGame: 0,
    },
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
  @ApiOkResponse({
    example: {
      items: [
        {
          id: 4,
          thumbnail: "https://example.com/thumbnail.jpg",
          title: "Introduction to Algebra",
          description: "This session will cover the basics of algebra.",
          startTime: "2024-06-01T10:00:00.000Z",
          endTime: "2024-06-01T12:00:00.000Z",
          presenterName: "Dr. Jane Doe",
          locationType: "online",
          roomInfo: "Room 101, Main Building",
          address: "123 Main St, Springfield",
          maxParticipant: 50,
          lateThreshold: 10,
          autoCheckIn: true,
          allowLateJoin: true,
          enableGame: true,
          autoScoring: true,
          maxGamePerSession: 3,
          gameTimeout: 60,
          emailNotification: true,
          smsNotification: true,
          reminderNotification: true,
          updatedAt: "2025-10-11T05:51:42.595Z",
          status: "completed",
          checked: 0,
          totalGame: 0,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
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
    items: SessionDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      data,
      total,
      totalPages,
      page: resPage,
      limit: resLimit,
    } = await this.sessionService.findAll({
      courseId,
      page: page,
      limit: limit,
    });
    return {
      items: plainToInstance(SessionDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      page: resPage,
      limit: resLimit,
      totalPages,
    };
  }

  @ApiOperation({
    summary: "Get session by ID",
    description:
      "Retrieve a specific session by its ID. No authentication required.",
    tags: ["Session Management"],
  })
  @ApiOkResponse({
    example: {
      id: 4,
      thumbnail: "https://example.com/thumbnail.jpg",
      title: "Introduction to Algebra",
      course: {
        id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
        title: "Introduction to Programming",
        code: "CS101",
        description: "Learn the basics of programming using Python.",
      },
      description: "This session will cover the basics of algebra.",
      startTime: "2024-06-01T10:00:00.000Z",
      endTime: "2024-06-01T12:00:00.000Z",
      presenterName: "Dr. Jane Doe",
      locationType: "online",
      roomInfo: "Room 101, Main Building",
      address: "123 Main St, Springfield",
      maxParticipant: 50,
      lateThreshold: 10,
      autoCheckIn: true,
      allowLateJoin: true,
      enableGame: true,
      autoScoring: true,
      maxGamePerSession: 3,
      gameTimeout: 60,
      emailNotification: true,
      smsNotification: true,
      reminderNotification: true,
      attendances: [],
      games: [],
      updatedAt: "2025-10-11T05:51:42.595Z",
      status: "completed",
      checked: 0,
      totalGame: 0,
    },
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
  @ApiOkResponse({
    example: {
      id: 4,
      thumbnail: "https://example.com/thumbnail.jpg",
      title: "Introduction to Algebra",
      course: {
        id: "bbeb693c-2474-4610-b45e-5a2f45ff686a",
        title: "Introduction to Programming",
        code: "CS101",
        description: "Learn the basics of programming using Python.",
      },
      description: "This session will cover the basics of algebra.",
      startTime: "2024-06-01T10:00:00.000Z",
      endTime: "2024-06-01T12:00:00.000Z",
      presenterName: "Dr. Jane Doe",
      locationType: "online",
      roomInfo: "Room 101, Main Building",
      address: "123 Main St, Springfield",
      maxParticipant: 50,
      lateThreshold: 10,
      autoCheckIn: true,
      allowLateJoin: true,
      enableGame: true,
      autoScoring: true,
      maxGamePerSession: 3,
      gameTimeout: 60,
      emailNotification: true,
      smsNotification: true,
      reminderNotification: true,
      attendances: [],
      games: [],
      updatedAt: "2025-10-11T06:14:25.512Z",
      status: "completed",
      checked: 0,
      totalGame: 0,
    },
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.SESSION_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch("session/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService
      .update(id, updateSessionDto)
      .then((session) =>
        plainToInstance(SessionDto, session, { excludeExtraneousValues: true }),
      );
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
  @ApiCreatedResponse({
    example: [
      {
        user: {
          id: "367276c4-f513-4331-86fe-be31f488960c",
          fullName: "Johny Doe",
          internationalName: "J. Doe",
        },
        attendTime: "2025-10-11T06:16:35.681Z",
      },
    ],
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
  @ApiCreatedResponse({
    example: [
      {
        user: {
          id: "367276c4-f513-4331-86fe-be31f488960c",
          fullName: "Johny Doe",
          internationalName: "J. Doe",
        },
        attendTime: "2025-10-11T06:16:35.681Z",
      },
    ],
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
