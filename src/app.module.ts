import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MemoryCleanupService } from "./memory/memory-cleanup.service";
import { AnalyticsModule } from "./modules/aa/analytics/analytics.module";
import { ActivityModule } from "./modules/ae/activity/activity.module";
import { GamificationModule } from "./modules/ae/gamification/gamification.module";
import { DatabaseModule } from "./modules/database/database.module";
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
import { EmailController } from './modules/email/email.controller';

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
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "phonglv.124010121062@vtc.edu.vn",
          pass: "gfti dkyv cdmk kvsi",
        },
      },
      defaults: {
        from: "L2brary <no-reply@l2brary-3.vercel.app>",
      },
      // template: {
      //   dir: join(__dirname, "templates/email"), // folder for templates
      //   adapter: new HandlebarsAdapter(), // or PugAdapter, EjsAdapter, etc.
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
  controllers: [AppController, EmailController],
  providers: [AppService, MemoryCleanupService, EmailService],
})
export class AppModule {}
