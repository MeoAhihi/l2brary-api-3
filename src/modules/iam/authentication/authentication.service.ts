import { compare } from "bcrypt";
import { PermissionEnum } from "src/common/permission.enum";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { PermissionService } from "../authorization/permission.service";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthPayload } from "../types/auth-payload.interface";
import { InviteCodeService } from "./invite-code.service";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly inviteCodeService: InviteCodeService,
    private readonly permissionService: PermissionService,
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

  async login(loginDto: LoginDto) {
    const userExisted = await this.validateUser(
      loginDto.phoneNumber,
      loginDto.password,
    );

    const user = await this.userService.findOne(userExisted.id, ["roles"]);
    const roleIds = user.roles.map((role) => role.id);
    const permissionEntities = await this.permissionService.findAll(roleIds);
    // This is safe as permissions enum are synchronized on startup,
    // and permission entities are readonly
    const permissions = permissionEntities.map((p) => p.name as PermissionEnum);

    return this.getTokens({ sub: user.id, permissions });
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync<AuthPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        },
      );

      const user = await this.userService.findOne(payload.sub, ["roles"]);
      const roleIds = user.roles.map((role) => role.id);
      const permissionEntities = await this.permissionService.findAll(roleIds);
      // This is safe as permissions enum are synchronized on startup,
      // and permission entities are readonly
      const permissions = permissionEntities.map(
        (p) => p.name as PermissionEnum,
      );

      // Generate new tokens
      return this.getTokens({ sub: user.id, permissions });
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

    // new members have no permissions
    return this.getTokens({ sub: user.id, permissions: [] });
  }
}
