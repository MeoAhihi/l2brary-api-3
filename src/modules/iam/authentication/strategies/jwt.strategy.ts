import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { AuthPayload } from "../../types/auth-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_SECRET") || "",
    });
  }

  async validate(payload: AuthPayload): Promise<AuthPayload> {
    if (!payload.sub) {
      throw new UnauthorizedException("JWT payload missing 'sub' property");
    }
    return payload;
  }
}
