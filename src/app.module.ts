import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MemoryCleanupService } from "./memory/memory-cleanup.service";
import { AnalyticsModule } from "./modules/aa/analytics/analytics.module";
import { ActivityModule } from "./modules/ae/activity/activity.module";
import { GamificationModule } from "./modules/ae/gamification/gamification.module";
import { DatabaseModule } from "./modules/database/database.module";
import { EmailController } from "./modules/email/email.controller";
import { EmailService } from "./modules/email/email.service";
import { AuthenticationModule } from "./modules/iam/authentication/authentication.module";
import { AuthorizationModule } from "./modules/iam/authorization/authorization.module";
import { UserModule } from "./modules/iam/user/user.module";
import { ArticleModule } from "./modules/ks/article/article.module";
import { CourseModule } from "./modules/ld/course/course.module";
import { EnrollmentModule } from "./modules/ld/enrollment/enrollment.module";
import { GameModule } from "./modules/ld/game/game.module";
import { ScoreModule } from "./modules/ld/score/score.module";
import { SessionModule } from "./modules/ld/session/session.module";
import { UploadModule } from "./modules/upload/upload.module";

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
    ScoreModule,
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("MAIL_HOST"),
          port: configService.get<number>("MAIL_PORT"),
          secure: configService.get<boolean>("MAIL_SECURE"),
          auth: {
            user: configService.get<string>("MAIL_USER"),
            pass: configService.get<string>("MAIL_PASS"),
          },
        },
        defaults: {
          from: configService.get<string>("MAIL_FROM"),
        },
      }),
      inject: [ConfigModule],
      imports: [ConfigModule],
    }),
    UploadModule,
  ],
  controllers: [AppController, EmailController],
  providers: [AppService, MemoryCleanupService, EmailService],
})
export class AppModule {}
