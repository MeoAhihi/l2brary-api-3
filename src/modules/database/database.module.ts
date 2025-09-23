import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { parseConnectionString } from "../../common/utils";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const CONNECTION_STRING =
          config.get<string>("MYSQL_DATABASE_URL") ?? "";
        const databaseConfig = parseConnectionString(CONNECTION_STRING);
        return {
          type: "mysql",
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
