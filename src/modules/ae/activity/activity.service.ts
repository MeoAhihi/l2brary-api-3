import { getMissing } from "@/common/compare-arrays";
import { FindOptionsWhere, In, Repository } from "typeorm";

import { ConflictException, Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import {
  SystemActivity,
  systemActivity,
  systemActivityCategories,
  systemActivityNames,
} from "../types/system-activities";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { Activity } from "./entities/activity.entity";

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existingActivities = await this.findExistingSystemActivities();
    const existingNames = existingActivities.map((a) => a.name);
    const systemActivities = Object.values<string>(SystemActivity);

    // Insert missing activities
    const missingActivityKeys = getMissing<string>(
      systemActivities,
      new Set(existingNames),
    );
    if (missingActivityKeys.length > 0) {
      const toInsert = this.createMissingSystemActivities(missingActivityKeys);
      await this.activityRepository.save(toInsert);
    }

    // Update existing activities if their definition has changed
    for (const activity of existingActivities) {
      const sysDef = systemActivity[activity.name as SystemActivity];
      if (
        sysDef &&
        (activity.point !== sysDef.point ||
          activity.category !== sysDef.category ||
          activity.isManual !== false)
      ) {
        Object.assign(activity, {
          point: sysDef.point,
          category: sysDef.category,
          isManual: false,
        });
        await this.activityRepository.save(activity);
      }
    }
  }

  private async findExistingSystemActivities(): Promise<Activity[]> {
    return this.activityRepository.find({
      where: {
        name: In(systemActivityNames),
        category: In(systemActivityCategories),
      },
    });
  }

  private createMissingSystemActivities(
    missingActivityKeys: string[],
  ): Activity[] {
    return missingActivityKeys.map((name) => {
      const { point, category } = systemActivity[name as SystemActivity];
      return this.activityRepository.create({
        name,
        category,
        point,
        isManual: false,
      });
    });
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
    activity.isManual = true;
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

  async findByName(name: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { name },
    });
    if (!activity) {
      throw new NotFoundException(`Activity with name "${name}" not found`);
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
