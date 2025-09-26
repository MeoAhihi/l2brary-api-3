import { User } from "@/modules/iam/user/entities/user.entity";
import { UserService } from "src/modules/iam/user/user.service";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ActivityService } from "../activity/activity.service";
import { SystemActivity } from "../types/system-activity.type";
import { LogActivityDto } from "./dto/log-activity.dto";
import { UpdateGamificationDto } from "./dto/update-gamification.dto";
import { ActivityLog } from "./entities/activity-log.entity";

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
  ) {}

  async create(
    loggedBy: string,
    logActivityDto: LogActivityDto,
  ): Promise<ActivityLog> {
    // Find the user by ID to ensure it exists and to get the full entity
    const user = await this.userService.findOne(logActivityDto.userId);

    const activity = await this.activityService.findOne(
      logActivityDto.activityId,
    );

    // Create a new ActivityLog entity
    const activityLog = this.activityLogRepository.create({
      user,
      activity,
      loggedBy,
      note: logActivityDto.note,
      createdAt: logActivityDto.createdAt ?? new Date(),
    });

    return this.activityLogRepository.save(activityLog);
  }

  async systemLogActivity(
    user: User,
    systemActivity: SystemActivity,
    note?: string,
  ): Promise<void> {
    try {
      // Use a special identifier for system actions, e.g., "system"
      const loggedBy = "system";

      // Find the activity and user in parallel
      const activity = await this.activityService.findByNameAndCategory(
        systemActivity.name,
        systemActivity.category,
      );

      // Create a new ActivityLog entity
      this.activityLogRepository.create({
        user,
        activity,
        loggedBy,
        note,
        createdAt: new Date(),
      });
    } catch (error) {
      // log the error here
      // DO NOT THROW ERROR, system log activity must not block main action
      console.error("Error in systemLogActivity:", error);
    }
  }

  async findAll(
    options: { userId?: string; page?: number; limit?: number } = {},
  ) {
    const { userId, page = 1, limit = 10 } = options;

    const query = this.activityLogRepository
      .createQueryBuilder("activityLog")
      .leftJoinAndSelect("activityLog.user", "user")
      .leftJoinAndSelect("activityLog.activity", "activity");

    if (userId) {
      query.andWhere("user.id = :userId", { userId });
    }

    query
      .orderBy("activityLog.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} gamification`;
  }

  update(id: number, updateGamificationDto: UpdateGamificationDto) {
    // forbide mutating system activity
    return `This action updates a #${id} gamification`;
  }

  remove(id: number) {
    // forbide removing system activity
    return `This action removes a #${id} gamification`;
  }

  async getActivityReportOfUser(userId: string) {
    // Get all activity logs for the user
    const activityLogs = await this.activityLogRepository.find({
      where: { user: { id: userId } },
      relations: ["activity"],
      order: { createdAt: "DESC" },
    });

    // Sum up activity points as engagement score
    const engagementScore = activityLogs.reduce((sum, log) => {
      return sum + (log.activity?.point || 0);
    }, 0);

    return {
      userId,
      engagementScore,
      activityLogs,
    };
  }
}
