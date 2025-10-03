export enum PermissionEnum {
  // IAM - User
  USER_CREATE = "user:create", // POST /user
  USER_READ_MANY = "user:readMany", // GET /user
  USER_READ_ONE = "user:readOne", // GET /user/:id
  USER_UPDATE = "user:update", // PATCH /user/:id
  USER_OFFBOARD = "user:offboard", // DELETE /user/:id
  USER_ASSIGN_ROLE = "user:assignRole", // POST /user/:id/roles/:roleId/assign
  USER_UNASSIGN_ROLE = "user:unassignRole", // POST /user/:id/roles/:roleId/unassign
  USER_PROFILE = "user:profile", // GET /user/profile

  // IAM - Authentication
  AUTH_INVITE = "authentication:invite", // POST /authentication/invite
  AUTH_FORGOT_PASSWORD = "authentication:forgotPassword", // POST /authentication/forgot-password
  AUTH_LOGIN = "authentication:login", // POST /authentication/login
  AUTH_REGISTER = "authentication:register", // POST /authentication/register/:inviteCode
  AUTH_RESET_PASSWORD = "authentication:resetPassword", // POST /authentication/reset-password/:resetPasswordCode
  AUTH_REFRESH_TOKEN = "authentication:refreshToken", // POST /authentication/refresh-token

  // IAM - Authorization (Roles & Permissions)
  ROLE_READ_ALL = "role:readAll", // GET /authorization/roles
  ROLE_READ_ONE = "role:readOne", // GET /authorization/roles/:id
  ROLE_CREATE = "role:create", // POST /authorization/roles
  ROLE_UPDATE = "role:update", // PATCH /authorization/roles/:id
  ROLE_DELETE = "role:delete", // DELETE /authorization/roles/:id
  ROLE_ATTACH_PERMISSIONS = "role:attachPermissions", // POST /authorization/roles/:roleId/permissions/attach
  ROLE_DETACH_PERMISSIONS = "role:detachPermissions", // POST /authorization/roles/:roleId/permissions/detach

  // LD - Course
  COURSE_CREATE = "course:create", // POST /course
  COURSE_READ_ALL = "course:readAll", // GET /course
  COURSE_READ_PUBLIC = "course:readPublic", // GET /course/public
  COURSE_READ_GROUPS = "course:readGroups", // GET /course/groups
  COURSE_READ_ONE = "course:readOne", // GET /course/:id
  COURSE_UPDATE = "course:update", // PATCH /course/:id
  COURSE_DELETE = "course:delete", // DELETE /course/:id

  // LD - Enrollment
  ENROLLMENT_CREATE = "enrollment:create", // POST /enrollment
  ENROLLMENT_READ_ALL = "enrollment:readAll", // GET /enrollment
  ENROLLMENT_READ_ONE = "enrollment:readOne", // GET /enrollment/:id
  ENROLLMENT_UPDATE = "enrollment:update", // PATCH /enrollment/:id
  ENROLLMENT_DELETE = "enrollment:delete", // DELETE /enrollment/:id

  // LD - Game
  GAME_CREATE = "game:create", // POST /game
  GAME_READ_ALL = "game:readAll", // GET /game
  GAME_READ_ONE = "game:readOne", // GET /game/:id
  GAME_DELETE = "game:delete", // DELETE /game/:id
  GAME_SUBMIT = "game:submit", // POST /game/:id/submit
  GAME_LOG = "game:logs", // POST /game/:id/logs

  // LD - Score
  SCORE_COLUMN_CREATE = "scoreColumn:create", // POST /score/column/{courseId}
  SCORE_COLUMN_READ_ALL = "scoreColumn:readAll", // GET /score/column/{courseId}
  SCORE_COLUMN_READ_ONE = "scoreColumn:readOne", // GET /score/column/detail/{id}
  SCORE_COLUMN_UPDATE = "scoreColumn:update", // PATCH /score/column/{id}
  SCORE_COLUMN_DELETE = "scoreColumn:delete", // DELETE /score/column/{id}
  SCORE_UPSERT = "score:upsert", // POST /score
  SCORE_TABLE_READ = "score:tableRead", // GET /score/table

  // LD - Session
  SESSION_CREATE = "session:create", // POST /course/{courseId}/session
  SESSION_READ_ALL = "session:readAll", // GET /course/{courseId}/session
  SESSION_READ_ONE = "session:readOne", // GET /session/{id}
  SESSION_UPDATE = "session:update", // PATCH /session/{id}
  SESSION_DELETE = "session:delete", // DELETE /session/{id}
  SESSION_ATTENDANCE_CREATE = "sessionAttendance:create", // POST /session/{id}/attendance
  SESSION_ATTENDANCE_READ = "sessionAttendance:read", // GET /session/{id}/attendance
  ATTENDANCE_DELETE = "attendance:delete", // DELETE /attendance/{id}

  // AE - Activity
  ACTIVITY_CREATE = "activity:create", // POST /activity
  ACTIVITY_READ_ALL = "activity:readAll", // GET /activity
  ACTIVITY_READ_ONE = "activity:readOne", // GET /activity/:id
  ACTIVITY_UPDATE = "activity:update", // PATCH /activity/:id
  ACTIVITY_DELETE = "activity:delete", // DELETE /activity/:id
  ACTIVITY_READ_CATEGORIES = "activity:readCategories", // GET /activity/categories

  // AE - Gamification
  GAMIFICATION_LOG_ACTIVITY = "gamification:logActivity", // POST /gamification/log-activity
  GAMIFICATION_READ_ALL = "gamification:readAll", // GET /gamification
  GAMIFICATION_READ_ONE = "gamification:readOne", // GET /gamification/:id
  GAMIFICATION_UPDATE = "gamification:update", // PATCH /gamification/:id
  GAMIFICATION_DELETE = "gamification:delete", // DELETE /gamification/:id
  GAMIFICATION_REPORT_READ = "gamification:reportRead", // GET /gamification/report/:userId

  // KS - Article
  ARTICLE_CREATE = "article:create", // POST /v1/api/article
  ARTICLE_READ_ALL = "article:readAll", // GET /v1/api/article
  ARTICLE_READ_ONE = "article:readOne", // GET /v1/api/article/{id}
  ARTICLE_UPDATE = "article:update", // PATCH /v1/api/article/{id}
  ARTICLE_DELETE = "article:delete", // DELETE /v1/api/article/{id}
  ARTICLE_REVIEW_UPDATE = "article:reviewUpdate", // PATCH /v1/api/article/{id}/review

  // AA - Track Growth
  TRACK_GROWTH_USERS_COUNT = "trackGrowth:usersCount", // GET /v1/api/analytics/track-growth/users/count
  TRACK_GROWTH_USERS_NEW = "trackGrowth:usersNew", // GET /v1/api/analytics/track-growth/users/new
  TRACK_GROWTH_USERS_ACTIVE = "trackGrowth:usersActive", // GET /v1/api/analytics/track-growth/users/active
  TRACK_GROWTH_USERS_ACTIVE_COUNT = "trackGrowth:usersActiveCount", // GET /v1/api/analytics/track-growth/users/active/count
  TRACK_GROWTH_USERS_INACTIVE = "trackGrowth:usersInactive", // GET /v1/api/analytics/track-growth/users/inactive
  TRACK_GROWTH_USERS_INACTIVE_COUNT = "trackGrowth:usersInactiveCount", // GET /v1/api/analytics/track-growth/users/inactive/count
  TRACK_GROWTH_USERS_RETENTION_RATE = "trackGrowth:usersRetentionRate", // GET /v1/api/analytics/track-growth/users/retention-rate
  TRACK_GROWTH_USERS_MONTHLY = "trackGrowth:usersMonthly", // GET /v1/api/analytics/track-growth/users/monthly

  // AA - Optimization
  OPTIMIZATION_TOTAL_ENROLLMENTS = "optimization:totalEnrollments", // GET /v1/api/analytics/optimization/total-enrollments
  OPTIMIZATION_AVERAGE_ATTENDANCE = "optimization:averageAttendance", // GET /v1/api/analytics/optimization/average-attendance
  OPTIMIZATION_ATTENDANCE_RATE = "optimization:attendanceRate", // GET /v1/api/analytics/optimization/attendance-rate
  OPTIMIZATION_TOP_USERS = "optimization:topUsers", // GET /v1/api/analytics/optimization/top-users

  // AA - Demographic
  DEMOGRAPHIC_RANK_READ = "demographic:rankRead", // GET /v1/api/demographic/rank
  DEMOGRAPHIC_GENDER_READ = "demographic:genderRead", // GET /v1/api/demographic/gender
  DEMOGRAPHIC_AGE_READ = "demographic:ageRead", // GET /v1/api/demographic/age
}
