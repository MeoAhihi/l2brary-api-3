import { User } from "@/modules/iam/user/entities/user.entity";
import { Attendance } from "@/modules/ld/session/entities/attendance.entity";
import { Activity } from "src/modules/ae/activity/entities/activity.entity";
import { ActivityLog } from "src/modules/ae/gamification/entities/activity-log.entity";
import { Course } from "src/modules/ld/course/entities/course.entity";
import { Enrollment } from "src/modules/ld/enrollment/entities/enrollment.entity";
import { Session } from "src/modules/ld/session/entities/session.entity";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AnalyticsOptimizationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  /**
   * Returns a map of courseId to total number of enrollments.
   */
  async getTotalEnrollmentsByCourse() {
    const enrollmentsRaw = await this.enrollmentRepository
      .createQueryBuilder("enrollment")
      .leftJoin("enrollment.course", "course")
      .select("enrollment.courseId", "courseId")
      .addSelect("course.title", "courseTitle")
      .addSelect("course.code", "courseCode")
      .addSelect("COUNT(enrollment.id)", "enrollmentCount")
      .groupBy("enrollment.courseId")
      .addGroupBy("course.title")
      .addGroupBy("course.code")
      .getRawMany<{
        courseId: string;
        courseTitle: string;
        courseCode: string;
        enrollmentCount: string;
      }>();

    // const enrollmentsMap = new Map<string, number>();
    // enrollmentsRaw.forEach((e) => {
    //   enrollmentsMap.set(e.courseId, Number(e.enrollmentCount));
    // });
    return enrollmentsRaw;
  }

  /**
   * Returns a map of courseId to average attendance per session.
   */
  async getAverageAttendancePerSessionByCourse(): Promise<Map<string, number>> {
    // Get sessions grouped by course (courseId is uuid string)
    const sessionsRaw = await this.sessionRepository
      .createQueryBuilder("session")
      .select("session.courseId", "courseId")
      .addSelect("COUNT(session.id)", "sessionCount")
      .groupBy("session.courseId")
      .getRawMany<{ courseId: string; sessionCount: string }>();

    const sessionsMap = new Map<string, number>();
    sessionsRaw.forEach((s) => {
      sessionsMap.set(s.courseId, Number(s.sessionCount));
    });

    // Get attendance counts grouped by course and session
    const attendanceRaw = await this.attendanceRepository
      .createQueryBuilder("attendance")
      .leftJoin("attendance.session", "session")
      .select("session.courseId", "courseId")
      .addSelect("attendance.sessionId", "sessionId")
      .addSelect("COUNT(attendance.id)", "attendanceCount")
      .groupBy("session.courseId")
      .addGroupBy("attendance.sessionId")
      .getRawMany<{
        courseId: string;
        sessionId: string;
        attendanceCount: string;
      }>();

    // Build attendance data per course
    const attendanceByCourse: Record<
      string,
      { totalAttendance: number; sessionCount: number }
    > = {};
    attendanceRaw.forEach((a) => {
      const courseId = a.courseId;
      const count = Number(a.attendanceCount);
      if (!attendanceByCourse[courseId]) {
        attendanceByCourse[courseId] = { totalAttendance: 0, sessionCount: 0 };
      }
      attendanceByCourse[courseId].totalAttendance += count;
      attendanceByCourse[courseId].sessionCount += 1;
    });

    // Calculate average attendance per session for each course
    const avgAttendanceMap = new Map<string, number>();
    sessionsMap.forEach((sessionCount, courseId) => {
      const attendanceData = attendanceByCourse[courseId] || {
        totalAttendance: 0,
        sessionCount: 0,
      };
      const avgAttendance =
        sessionCount > 0 ? attendanceData.totalAttendance / sessionCount : 0;
      avgAttendanceMap.set(courseId, avgAttendance);
    });

    return avgAttendanceMap;
  }

  /**
   * Returns a map of courseId to overall attendance rate (percentage of enrolled members who attend at least one session).
   */
  async getOverallAttendanceRateByCourse(): Promise<Map<string, number>> {
    // Get total enrollments per course
    const enrollmentsRaw = await this.enrollmentRepository
      .createQueryBuilder("enrollment")
      .select("enrollment.courseId", "courseId")
      .addSelect("COUNT(enrollment.id)", "enrollmentCount")
      .groupBy("enrollment.courseId")
      .getRawMany<{ courseId: string; enrollmentCount: string }>();

    const enrollmentsMap = new Map<string, number>();
    enrollmentsRaw.forEach((e) => {
      enrollmentsMap.set(e.courseId, Number(e.enrollmentCount));
    });

    // Get unique attendance per course
    const uniqueAttendanceRaw = await this.attendanceRepository
      .createQueryBuilder("attendance")
      .leftJoin("attendance.session", "session")
      .select("session.courseId", "courseId")
      .addSelect("COUNT(DISTINCT attendance.userId)", "attendedCount")
      .groupBy("session.courseId")
      .getRawMany<{ courseId: string; attendedCount: string }>();

    const attendedMap = new Map<string, number>();
    uniqueAttendanceRaw.forEach((a) => {
      attendedMap.set(a.courseId, Number(a.attendedCount));
    });

    // Calculate overall attendance rate for each course
    const attendanceRateMap = new Map<string, number>();
    enrollmentsMap.forEach((totalEnrollments, courseId) => {
      const attended = attendedMap.get(courseId) || 0;
      const rate = totalEnrollments > 0 ? attended / totalEnrollments : 0;
      attendanceRateMap.set(courseId, rate);
    });

    return attendanceRateMap;
  }

  /**
   * Returns the top N users with the highest total activity points in a given period.
   * @param from Date - start of period
   * @param to Date - end of period
   * @param limit number - number of top users to return
   */
  async getTopUsersByActivityPoints(from: Date, to: Date, limit = 10) {
    return this.activityLogRepository
      .createQueryBuilder("log")
      .leftJoin("log.user", "user")
      .leftJoin("log.activity", "activity")
      .select("user.id", "userId")
      .addSelect("user.fullName", "name")
      .addSelect("SUM(activity.point)", "totalPoints")
      .where("log.createdAt >= :from AND log.createdAt <= :to", { from, to })
      .groupBy("user.id")
      .addGroupBy("user.fullName")
      .orderBy("totalPoints", "DESC")
      .limit(limit)
      .getRawMany();
  }

  /**
   * Returns the most popular activities (by count of logs) in a given period.
   * @param from Date - start of period
   * @param to Date - end of period
   * @param limit number - number of top activities to return
   */
  async getMostPopularActivities(from: Date, to: Date, limit = 5) {
    return this.activityLogRepository
      .createQueryBuilder("log")
      .leftJoin("log.activity", "activity")
      .select("activity.name", "activityName")
      .addSelect("COUNT(log.id)", "count")
      .where("log.createdAt >= :from AND log.createdAt <= :to", { from, to })
      .groupBy("activity.name")
      .orderBy("count", "DESC")
      .limit(limit)
      .getRawMany();
  }

  /**
   * Returns the average activity points per user in a given period.
   * @param from Date - start of period
   * @param to Date - end of period
   */
  async getAverageActivityPointsPerUser(from: Date, to: Date): Promise<number> {
    const raw = await this.activityLogRepository
      .createQueryBuilder("log")
      .leftJoin("log.user", "user")
      .leftJoin("log.activity", "activity")
      .select("user.id", "userId")
      .addSelect("SUM(activity.point)", "totalPoints")
      .where("log.createdAt >= :from AND log.createdAt <= :to", { from, to })
      .groupBy("user.id")
      .getRawMany<{ userId: number; totalPoints: string }>();

    if (raw.length === 0) return 0;
    const total = raw.reduce((sum, r) => sum + Number(r.totalPoints), 0);
    return total / raw.length;
  }

  /**
   * Returns the percentage of users who have not performed any activity in a given period.
   * @param from Date - start of period
   * @param to Date - end of period
   */
  async getInactiveUserPercentage(from: Date, to: Date): Promise<number> {
    // Get all users
    const totalUsers = await this.userRepository.count();

    // Get users who have at least one activity log in the period
    const activeUsers = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("log.userId", "userId")
      .where("log.createdAt >= :from AND log.createdAt <= :to", { from, to })
      .groupBy("log.userId")
      .getRawMany<{ userId: number }>();

    const activeUserIds = new Set(activeUsers.map((u) => u.userId));
    const inactiveCount = totalUsers - activeUserIds.size;
    if (totalUsers === 0) return 0;
    return (inactiveCount / totalUsers) * 100;
  }
}
