import { User } from "@/modules/iam/user/entities/user.entity";
import { UserService } from "@/modules/iam/user/user.service";
import { Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

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

  async markAttendance(sessionId: number, userId: string): Promise<Attendance> {
    const session = await this.sessionService.findOne(sessionId);

    const user = await this.userService.findOne(userId);

    // Check if attendance already exists
    let attendance = await this.attendanceRepository.findOne({
      where: { session: { id: sessionId }, user: { id: userId } },
    });

    if (!attendance) {
      attendance = this.attendanceRepository.create({
        session,
        user,
        attendTime: new Date(),
      });
      await this.attendanceRepository.save(attendance);
    }

    return attendance;
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

  async removeAttendance(sessionId: number, userId: string): Promise<void> {
    const attendance = await this.attendanceRepository.findOne({
      where: { session: { id: sessionId }, user: { id: userId } },
    });
    if (!attendance) {
      throw new NotFoundException("Attendance not found");
    }
    await this.attendanceRepository.remove(attendance);
  }
}
