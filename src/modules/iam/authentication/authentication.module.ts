import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthorizationModule } from "../authorization/authorization.module";
import { UserModule } from "../user/user.module";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { InviteCode } from "./entities/invite-code.entity";
import { InviteCodeService } from "./invite-code.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([InviteCode]),
    AuthorizationModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, InviteCodeService, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
