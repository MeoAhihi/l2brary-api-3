import { User } from "@/modules/iam/user/entities/user.entity";
import { getLast12Months } from "src/common/utils";
import { ActivityLog } from "src/modules/ae/gamification/entities/activity-log.entity";
import { Between, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TrackGrowthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }

  async countNewUsers(from: Date, to: Date) {
    return this.userRepository.count({
      where: {
        createdAt: Between(from, to),
      },
    });
  }

  async getActiveUsers(minScore = 0) {
    return this.activityLogRepository
      .createQueryBuilder("log")
      .leftJoin("log.user", "user")
      .leftJoin("log.activity", "activity")
      .select("user.id", "userId")
      .addSelect("user.fullName", "name")
      .addSelect("SUM(activity.point)", "totalScore")
      .groupBy("user.id")
      .addGroupBy("user.fullName")
      .having("SUM(activity.point) > :minScore", { minScore })
      .getRawMany();
  }

  async countActiveUsers(minScore = 0) {
    return this.getActiveUsers(minScore).then((users) => users.length);
  }

  async countNewUsersByMonthLast12() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const raw = await this.userRepository
      .createQueryBuilder("user")
      .select([
        `TO_CHAR(user.createdAt, 'YYYY-MM') AS month`,
      ])
      .addSelect("COUNT(*)", "count")
      .where("user.createdAt >= :start AND user.createdAt < :end", {
        start,
        end,
      })
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany<{
        month: string;
        count: string | number;
      }>();
    const months = getLast12Months(start);

    return months.map((month) => {
      const found = raw.find((r) => r.month === month);
      return {
        month,
        count: found ? Number(found.count) : 0,
      };
    });
  }

  /**
   * Returns users who are considered inactive.
   * Inactive users are those who have not performed any activity (no ActivityLog entries)
   * or whose total activity points are less than or equal to the given maxScore (default 0).
   */
  async getInactiveUsers(
    maxScore = 0,
    from: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: Date = new Date(),
  ) {
    // Users with no activity logs or total points <= maxScore in the interval
    // Left join ActivityLog and Activity, group by user, sum points, filter
    return this.userRepository
      .createQueryBuilder("user")
      .leftJoin(
        "user.activityLogs",
        "activityLog",
        "activityLog.createdAt >= :from AND activityLog.createdAt <= :to",
        { from, to },
      )
      .leftJoin("activityLog.activity", "activity")
      .select([
        "user.id AS id",
        "user.fullName AS fullName",
        "COALESCE(SUM(activity.point), 0) AS totalPoints",
      ])
      .groupBy("user.id")
      .addGroupBy("user.fullName")
      .having("COALESCE(SUM(activity.point), 0) <= :maxScore", { maxScore })
      .getRawMany();
  }

  /**
   * Returns the count of inactive users.
   * Inactive users are those who have not performed any activity (no ActivityLog entries)
   * or whose total activity points are less than or equal to the given maxScore (default 0).
   */
  async countInactiveUsers(
    maxScore = 0,
    from: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: Date = new Date(),
  ): Promise<number> {
    const inactiveUsers = await this.getInactiveUsers(maxScore, from, to);
    return inactiveUsers.length;
  }

  /**
   * Calculates the user retention rate for a given period.
   * Retention rate is defined as the percentage of users who registered in a previous period
   * and are still active (performed at least one activity) in the current period.
   *
   * @param prevFrom Date - start of previous period
   * @param prevTo Date - end of previous period
   * @param currFrom Date - start of current period
   * @param currTo Date - end of current period
   * @returns { totalRegistered: number, retained: number, retentionRate: number }
   */
  async getRetentionRate(
    prevFrom: Date,
    prevTo: Date,
    currFrom: Date,
    currTo: Date,
  ): Promise<{
    totalRegistered: number;
    retained: number;
    retentionRate: number;
  }> {
    // Get users who registered in the previous period
    const prevUsers = await this.userRepository
      .createQueryBuilder("user")
      .select("user.id", "id")
      .where("user.createdAt >= :prevFrom AND user.createdAt <= :prevTo", {
        prevFrom,
        prevTo,
      })
      .getRawMany<{ id: number }>();

    const prevUserIds = prevUsers.map((u) => u.id);

    if (prevUserIds.length === 0) {
      return { totalRegistered: 0, retained: 0, retentionRate: 0 };
    }

    // Of those users, how many performed at least one activity in the current period?
    const retained = await this.userRepository
      .createQueryBuilder("user")
      .innerJoin("user.activityLogs", "activityLog")
      .where("user.id IN (:...ids)", { ids: prevUserIds })
      .andWhere(
        "activityLog.createdAt >= :currFrom AND activityLog.createdAt <= :currTo",
        {
          currFrom,
          currTo,
        },
      )
      .select("user.id", "id")
      .groupBy("user.id")
      .getRawMany<{ id: number }>();

    const retainedCount = retained.length;
    const totalRegistered = prevUserIds.length;
    const retentionRate =
      totalRegistered === 0 ? 0 : retainedCount / totalRegistered;

    return {
      totalRegistered,
      retained: retainedCount,
      retentionRate,
    };
  }
}
