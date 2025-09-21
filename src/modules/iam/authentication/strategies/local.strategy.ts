import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticationService } from "../authentication.service";
import { AuthPayload } from "../interfaces/auth-payload.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({
      usernameField: "phoneNumber",
      passwordField: "password",
    });
  }

  async validate(phoneNumber: string, password: string): Promise<AuthPayload> {
    const user = await this.authService.validateUser(phoneNumber, password);
    return {
      sub: user.id,
    };
  }
}
