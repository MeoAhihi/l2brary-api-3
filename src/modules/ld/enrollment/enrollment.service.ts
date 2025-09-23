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
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { UpdateEnrollmentDto } from "./dto/update-enrollment.dto";
import { Enrollment } from "./entities/enrollment.entity";

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>, // Replace 'any' with the actual repository type when available
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}

  create(createEnrollmentDto: CreateEnrollmentDto) {
    return "This action adds a new enrollment";
  }

  async findAll({
    page = 1,
    limit = 10,
    courseId,
  }: {
    page?: number;
    limit?: number;
    courseId?: string;
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

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
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
    });
    await this.enrollmentRepository.save(enrollment);
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
}
