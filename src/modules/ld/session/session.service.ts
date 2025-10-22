import { Between, In, Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CourseService } from "../course/course.service";
import { EnrollmentService } from "../enrollment/enrollment.service";
import { EnrollmentStatusEnum } from "../types/enrollment-status.enum";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Session } from "./entities/session.entity";

@Injectable()
export class SessionService {
  constructor(
    // Inject the Session repository for database operations
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly courseService: CourseService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  async create(
    courseId: string,
    createSessionDto: CreateSessionDto,
  ): Promise<Session> {
    // Fetch the course entity to ensure it exists and to associate it properly
    const course = await this.courseService.findOne(courseId);

    const session = this.sessionRepository.create({
      ...createSessionDto,
      startTime: createSessionDto.startTime ?? new Date(),
      updatedAt: new Date(),
      course: course,
    });

    return this.sessionRepository.save(session);
  }

  async findAll({
    courseId,
    page = 1,
    limit = 10,
  }: {
    courseId: string;
    page?: number;
    limit?: number;
  }) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await this.sessionRepository.findAndCount({
      where: { course: { id: courseId } },
      skip,
      take: limit,
      order: { startTime: "DESC" },
      relations: ["attendances", "games"],
    });
    return {
      data: sessions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ["course", "attendances", "attendances.user", "games"],
    });
    if (!session) {
      throw new NotFoundException(`Session with id ${id} not found`);
    }
    return session;
  }

  async update(
    id: number,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const session = await this.findOne(id);
    Object.assign(session, updateSessionDto);
    session.updatedAt = new Date();
    return this.sessionRepository.save(session);
  }

  async remove(id: number): Promise<void> {
    const session = await this.findOne(id);
    session.deletedAt = new Date();
    await this.sessionRepository.save(session);
  }

  async getSessionsByUser(userId: string, from: Date, to: Date) {
    const { enrollment: enrollments } =
      await this.enrollmentService.findByUserAndCourse(userId);
    console.log("🚀 ~ SessionService ~ getSessionsByUser ~ enrollments:", enrollments)
    if (!enrollments || enrollments.length) return [];
    const joinedCoursesOfUser = enrollments
      .filter((e) => e.status === EnrollmentStatusEnum.APPROVED)
      .map((e) => e.course);
    // console.log("🚀 ~ SessionService ~ getSessionsByUser ~ joinedCoursesOfUser:", joinedCoursesOfUser)

    // Get sessions of the user's joined courses that start between 'from' and 'to'
    if (!joinedCoursesOfUser.length) return [];

    const sessions = await this.sessionRepository.find({
      where: {
        course: { id: In(joinedCoursesOfUser.map((c) => c.id)) },
        startTime: Between(from, to),
      },
      order: { startTime: "ASC" },
      relations: ["course", "games", "attendances"],
    });

    return sessions;
  }
}
