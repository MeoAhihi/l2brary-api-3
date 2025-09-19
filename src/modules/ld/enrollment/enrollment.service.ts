import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/modules/iam/user/user.service";
import { Repository } from "typeorm";
import { CourseService } from "../course/course.service";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { UpdateEnrollmentDto } from "./dto/update-enrollment.dto";
import { Enrollment } from "./entities/enrollment.entity";
import { EnrollmentStatusEnum } from "./types/enrollment-status.enum";
@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>, // Replace 'any' with the actual repository type when available
    private readonly userService: UserService,
    private readonly courseService: CourseService
  ) {}

  create(createEnrollmentDto: CreateEnrollmentDto) {
    return "This action adds a new enrollment";
  }

  findAll() {
    return `This action returns all enrollment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
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
}
