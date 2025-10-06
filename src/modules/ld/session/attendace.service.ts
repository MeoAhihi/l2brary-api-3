import { User } from "@/modules/iam/user/entities/user.entity";
import { UserService } from "@/modules/iam/user/user.service";
import { Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { MarkAttendanceDto } from "./dto/mark-attendance.dto";
import { Attendance } from "./entities/attendance.entity";
import { SessionService } from "./session.service";

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  /**
   * Marks attendance for a session for the given user IDs.
   *
   * - Only users who have not already attended will be marked.
   * - Throws NotFoundException if the session does not exist.
   * - Throws NotFoundException if any userId does not correspond to an existing user.
   *
   * @param sessionId - The ID of the session.
   * @param markAttendanceDto - DTO containing userIds and optional time.
   * @returns Array of newly created Attendance entities.
   */
  async markAttendance(
    sessionId: number,
    markAttendanceDto: MarkAttendanceDto,
  ): Promise<Attendance[]> {
    // Find the session and get current attendances in parallel
    const [session, lastAttendances] = await Promise.all([
      this.sessionService.findOne(sessionId),
      this.getSessionAttendances(sessionId),
    ]);
    const attendedUserIds = lastAttendances.map((a) => a.user.id);

    // Filter out userIds that have already attended
    const notAttendedUserIds = markAttendanceDto.userIds.filter(
      (userId) => !attendedUserIds.includes(userId),
    );

    if (notAttendedUserIds.length === 0) {
      // All users have already attended, nothing to do
      return [];
    }

    // Fetch users by IDs, check for missing users
    const { items: usersNotAttended } = await this.userService.findAll({
      ids: notAttendedUserIds,
    });

    // const foundUserIds = usersNotAttended.map((u) => u.id);
    // const missingUserIds = notAttendedUserIds.filter(
    //   (id) => !foundUserIds.includes(id),
    // );
    // if (missingUserIds.length > 0) {
    //   throw new NotFoundException(
    //     `User(s) not found: ${missingUserIds.join(", ")}`,
    //   );
    // }

    // Create new attendance entities for users who have not attended
    const newAttendances = usersNotAttended.map((user) =>
      this.attendanceRepository.create({
        session,
        user,
        attendTime: markAttendanceDto.time ?? new Date(),
      }),
    );

    // Save all new attendances in bulk (if any)
    return await this.attendanceRepository.save(newAttendances);
  }

  async getSessionAttendances(sessionId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { session: { id: sessionId } },
      relations: ["user"],
    });
  }

  async getUserAttendance(userId: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { user: { id: userId } },
      relations: ["session"],
    });
  }

  async removeAttendance(id: number): Promise<void> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });
    if (!attendance) {
      throw new NotFoundException("Attendance not found");
    }
    await this.attendanceRepository.remove(attendance);
  }
}
