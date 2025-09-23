import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationController } from "./authentication.controller";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { InviteCodeService } from "./invite-code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InviteCode } from "./entities/invite-code.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthorizationModule } from "../authorization/authorization.module";

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
