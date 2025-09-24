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
          type: "postgres",
          url: CONNECTION_STRING,
          autoLoadEntities: true,
          synchronize: true,
          ssl: {
            rejectUnauthorized: false,  // allow self-signed certs (needed for many cloud DBs)
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
