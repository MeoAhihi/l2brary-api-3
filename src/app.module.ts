import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./modules/database/database.module";
import { UserModule } from "./modules/iam/user/user.module";
import { CourseModule } from "./modules/ld/course/course.module";
import { AnalyticsModule } from "./modules/aa/analytics/analytics.module";
import { ActivityModule } from "./modules/ae/activity/activity.module";
import { GamificationModule } from "./modules/ae/gamification/gamification.module";
import { AuthenticationModule } from "./modules/iam/authentication/authentication.module";
import { ArticleModule } from "./modules/ks/article/article.module";
import { EnrollmentModule } from "./modules/ld/enrollment/enrollment.module";
import { GameModule } from "./modules/ld/game/game.module";
import { SessionModule } from "./modules/ld/session/session.module";
import { AuthorizationModule } from "./modules/iam/authorization/authorization.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    UserModule,
    AuthenticationModule,
    AuthorizationModule,
    CourseModule,
    EnrollmentModule,
    SessionModule,
    GameModule,
    ActivityModule,
    GamificationModule,
    ArticleModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
