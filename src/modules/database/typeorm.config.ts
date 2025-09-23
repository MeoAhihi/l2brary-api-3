import { DataSource } from "typeorm";

import { ConfigModule, ConfigService } from "@nestjs/config";

import { parseConnectionString } from "../../common/utils";

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ".env",
});

const configService = new ConfigService();

const CONNECTION_STRING = configService.get<string>("MYSQL_DATABASE_URL") ?? "";

const config = parseConnectionString(CONNECTION_STRING);

export default new DataSource({
  type: "mysql",
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/migrations/*.ts"],
});
