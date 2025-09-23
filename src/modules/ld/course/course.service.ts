import { UTC7EndOfDate, UTC7StartOfDate } from "src/common/datetime.utils";
import { FindOptionsWhere, ILike, Repository } from "typeorm";

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Course } from "./entities/course.entity";
import { ScheduleDetail, ScheduleType } from "./types/schedule.types";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  isValidateSchedule(
    scheduleType: ScheduleType,
    scheduleDetail: ScheduleDetail,
  ): boolean {
    // Check if scheduleDetail matches the expected structure for the given scheduleType
    if (!scheduleDetail || !scheduleType) {
      return false;
    }

    switch (scheduleType) {
      case ScheduleType.WEEKLY:
        // Should have daysOfWeek as a non-empty array of Weekday
        return (
          Array.isArray((scheduleDetail as any).daysOfWeek) &&
          (scheduleDetail as any).daysOfWeek.length > 0 &&
          (scheduleDetail as any).daysOfWeek.every(
            (d: any) =>
              Object.values(ScheduleType).includes(d) || // fallback, but should be Weekday
              [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
              ].includes(d),
          )
        );
      case ScheduleType.MONTHLY:
      case ScheduleType.LUNAR_MONTHLY:
        // Should have daysOfMonth as a non-empty array of numbers between 1 and 31
        return (
          Array.isArray((scheduleDetail as any).daysOfMonth) &&
          (scheduleDetail as any).daysOfMonth.length > 0 &&
          (scheduleDetail as any).daysOfMonth.every(
            (d: any) => typeof d === "number" && d >= 1 && d <= 31,
          )
        );
      case ScheduleType.ONE_TIME:
        // Should have dates as a non-empty array of Date or date strings
        return (
          Array.isArray((scheduleDetail as any).dates) &&
          (scheduleDetail as any).dates.length > 0 &&
          (scheduleDetail as any).dates.every(
            (d: any) =>
              d instanceof Date ||
              (typeof d === "string" && !isNaN(Date.parse(d))),
          )
        );
      default:
        return false;
    }
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    // Check if scheduleDetail matches the expected structure for the given scheduleType
    const { scheduleType, scheduleDetail } = createCourseDto;
    if (!this.isValidateSchedule(scheduleType, scheduleDetail)) {
      throw new ConflictException(
        "Invalid scheduleDetail for the given scheduleType",
      );
    }

    // Transform enrollmentDeadlineDate, startDate, endDate from string to Date
    if (createCourseDto.enrollmentDeadlineDate) {
      (createCourseDto as any).enrollmentDeadline = UTC7EndOfDate(
        createCourseDto.enrollmentDeadlineDate,
      );
      delete (createCourseDto as any).enrollmentDeadlineDate;
    }
    if (createCourseDto.startDate) {
      (createCourseDto as any).startDate = UTC7StartOfDate(
        createCourseDto.startDate,
      );
    }
    if (createCourseDto.endDate) {
      (createCourseDto as any).endDate = UTC7EndOfDate(createCourseDto.endDate);
    }

    const course = this.courseRepository.create(createCourseDto);
    course.createdAt = new Date();
    course.updatedAt = new Date();
    return await this.courseRepository.save(course);
  }

  async findAll({
    page = 1,
    limit = 10,
    search,
    group,
    scheduleType,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    group?: string;
    scheduleType?: ScheduleType;
  } = {}) {
    const where: FindOptionsWhere<Course> = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }

    if (group) {
      where.group = group;
    }

    if (scheduleType) {
      where.scheduleType = scheduleType;
    }

    const [items, total] = await this.courseRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      items,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findCourseGroup(): Promise<string[]> {
    // Returns a list of unique course groups
    const groups = await this.courseRepository
      .createQueryBuilder("course")
      .select("course.group", "group")
      .distinct(true)
      .getRawMany();
    return groups.map<string>((g) => g.group);
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} does not exist`);
    }
    return course;
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: string) {
    return `This action removes a #${id} course`;
  }
}
