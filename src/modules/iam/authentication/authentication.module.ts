import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationController } from "./authentication.controller";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InviteCodeService } from "./invite-code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InviteCode } from "./entities/invite-code.entity";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([InviteCode]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, InviteCodeService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
