import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { compare } from "bcrypt";
import { User } from "../user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthPayload } from "./interfaces/auth-payload.interface";
import { InviteCodeService } from "./invite-code.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly inviteCodeService: InviteCodeService
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<User> {
    const user = await this.userService.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new UnauthorizedException("Invalid phone number or password");
    }
    // Use bcrypt.compare to check if the provided password matches the stored hash
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid phone number or password");
    }
    // Return user data as AuthPayload or user object as needed
    return user;
  }

  async getTokens(payload: AuthPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
        expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRATION"),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRATION"),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync<AuthPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        }
      );

      // Optionally, you can check if the user still exists or is active
      const user = await this.userService.findOne(payload.sub);

      // Generate new tokens
      return this.getTokens({ sub: user.id });
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async register(inviteCode: string, registerDto: RegisterDto) {
    // Validate the invite code
    await this.inviteCodeService.findOneByCode(inviteCode);
    // Create the user using the provided registration data
    const user = await this.userService.create(registerDto);
    // Optionally, you could mark the invite code as used or delete it
    await this.inviteCodeService.delete(inviteCode);

    return this.getTokens({ sub: user.id });
  }
}
