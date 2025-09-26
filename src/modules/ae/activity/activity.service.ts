import { FindOptionsWhere, In, Repository } from "typeorm";

import { ConflictException, Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SystemActivities } from "../types/system-activities";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { Activity } from "./entities/activity.entity";

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async onModuleInit() {
    // Get all existing activities from the DB (by category)
    const systemActivityNames = SystemActivities.map((a) => a.name);
    const existingSystemActivities = await this.activityRepository.find({
      where: {
        name: In(systemActivityNames),
      },
    });

    // Create a set of unique keys for existing activities (name + category)
    const existingActivityKeys = new Set(
      existingSystemActivities.map((a) => `${a.name}||${a.category}`),
    );

    // Find missing activities (by name + category)
    const missingActivities = SystemActivities.filter(
      (activity) =>
        !existingActivityKeys.has(`${activity.name}||${activity.category}`),
    );

    if (missingActivities.length > 0) {
      const newActivities = missingActivities.map((activity) =>
        this.activityRepository.create({
          name: activity.name,
          point: activity.point,
          category: activity.category,
        }),
      );
      await this.activityRepository.save(newActivities);
    }
  }

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const existing = await this.activityRepository.findOne({
      where: {
        name: createActivityDto.name,
        category: createActivityDto.category,
      },
    });
    if (existing) {
      throw new ConflictException(
        `Activity with name "${createActivityDto.name}" and category "${createActivityDto.category}" already exists`,
      );
    }
    const activity = this.activityRepository.create(createActivityDto);
    return this.activityRepository.save(activity);
  }

  async findAll(options: { category?: string } = {}): Promise<Activity[]> {
    const where: FindOptionsWhere<Activity> = {};
    if (options.category) {
      where.category = options.category;
    }
    return this.activityRepository.find({ where });
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOneBy({ id });
    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }
    return activity;
  }

  async update(
    id: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOne(id);
    Object.assign(activity, updateActivityDto);
    return this.activityRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    await this.activityRepository.delete(id);
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.activityRepository
      .createQueryBuilder("activity")
      .select("activity.category", "category")
      // .distinct(true)
      .getRawMany();
    return categories.map<string>((c) => c.category);
  }
}
