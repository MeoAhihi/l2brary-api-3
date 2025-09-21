import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "./modules/database/database.module";
import { UserModule } from "./modules/iam/user/user.module";
import { CourseModule } from "./modules/ld/course/course.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Logger } from "@nestjs/common";
import { EnrollmentModule } from './modules/ld/enrollment/enrollment.module';
import { SessionModule } from './modules/ld/session/session.module';
import { GameModule } from './modules/ld/game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    UserModule,
    CourseModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_DATABASE_URL") ?? "",
        connectionFactory: (connection) => {
          const logger = new Logger("MongooseConnection");
          connection.on("connected", () => {
            logger.log("MongoDB connected");
          });
          connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected");
          });
          connection.on("reconnected", () => {
            logger.log("MongoDB reconnected");
          });
          return connection;
        },
      }),
    }),
    EnrollmentModule,
    SessionModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
