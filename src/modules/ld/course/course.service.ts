import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Course } from "./entities/course.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { ScheduleType } from "./types/schedule.types";
@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  create(createCourseDto: CreateCourseDto) {
    return "This action adds a new course";
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
