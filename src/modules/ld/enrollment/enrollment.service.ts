import { GamificationService } from "@/modules/ae/gamification/gamification.service";
import { SystemActivity } from "@/modules/ae/types/system-activities";
import { UserService } from "src/modules/iam/user/user.service";
import { FindOptionsWhere, Repository } from "typeorm";

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CourseService } from "../course/course.service";
import { EnrollmentStatusEnum } from "../types/enrollment-status.enum";
import { Enrollment } from "./entities/enrollment.entity";

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>, // Replace 'any' with the actual repository type when available
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly gamificationService: GamificationService,
  ) {}

  async findAll({
    page = 1,
    limit = 10,
    courseId,
    status,
  }: {
    page?: number;
    limit?: number;
    courseId?: string;
    status?: EnrollmentStatusEnum;
  } = {}): Promise<{
    items: Enrollment[];
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  }> {
    const where: FindOptionsWhere<Enrollment> = {};
    if (courseId) {
      where.course = { id: courseId };
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.enrollmentRepository.findAndCount({
      where,
      relations: ["user", "course"],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "DESC" },
    });

    return {
      items,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ["user", "course"],
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }
    return enrollment;
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<{ message: string; enrollment: Enrollment | null }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId },
      },
      relations: ["user", "course"],
    });

    return {
      message: enrollment ? "Enrollment found" : "No Enrollment found",
      enrollment,
    };
  }

  async update(id: number, status: EnrollmentStatusEnum): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ["user", "course"],
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }
    enrollment.status = status;
    await this.enrollmentRepository.save(enrollment);
    return enrollment;
  }

  async enroll(userId: string, courseId: string) {
    // Get the user and course entity
    const user = await this.userService.findOne(userId);
    const course = await this.courseService.findOne(courseId);

    // Check if the course is enrollable
    if (!course.isEnrollable) {
      throw new ForbiddenException("Course is not open for enrollment");
    }

    // Check if the user is already enrolled in this course
    // Assuming there is a method or repository to check enrollment
    if (await this.isUserEnrolled(userId, courseId)) {
      throw new ForbiddenException("User is already enrolled in this course");
    }

    const enrollment = this.enrollmentRepository.create({
      user,
      course,
      status: EnrollmentStatusEnum.PENDING, // or EnrollmentStatusEnum.PENDING if imported
      enrolledAt: new Date(),
    });
    await this.enrollmentRepository.save(enrollment);
    await this.gamificationService.systemLogActivity(
      userId,
      SystemActivity.ENROLLMENT_APPROVED,
      "Action completed from L&D Domain",
    );
    return enrollment;
  }

  /**
   * Checks if a user is already enrolled in a course.
   * @param userId The user's ID
   * @param courseId The course's ID
   * @returns Promise<boolean>
   */
  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    // Assuming you have access to the enrollment repository or model
    // and Enrollment entity has user and course relations
    // Replace 'this.enrollmentRepository' with your actual repository instance

    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId },
      },
    });
    return !!enrollment;
  }

  async manageEnrollment(id: number, status: EnrollmentStatusEnum) {
    // Find the enrollment by ID
    const enrollment = await this.findOne(id);

    // Update the status
    enrollment.status = status;

    // Save the updated enrollment
    await this.enrollmentRepository.save(enrollment);

    return enrollment;
  }

  async remove(id: number) {
    // Remove the enrollment by ID
    const enrollment = await this.findOne(id);
    await this.enrollmentRepository.remove(enrollment);
    return { message: `Enrollment with id ${id} has been removed.` };
  }
}
