import { PermissionEnum } from "@/common/permission.enum";

import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiQuery } from "@nestjs/swagger";

import { RequirePermission } from "../authorization/decorators/permission.decorator";
import { PermissionGuard } from "../authorization/guards/permission.guard";
import { AuthenticationService } from "./authentication.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { InviteCodeService } from "./invite-code.service";
import { ResetPasswordCodeService } from "./reset-password-code.service";

@Controller("authentication")
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly inviteCodeService: InviteCodeService,
    private readonly resetPasswordCodeService: ResetPasswordCodeService,
  ) {}

  @RequirePermission(PermissionEnum.AUTH_INVITE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @ApiQuery({
    name: "email",
    required: false,
    type: String,
    description: "Optional email address to associate with the invite code",
  })
  @Post("invite")
  async invite(@Query("email") email?: string) {
    return this.inviteCodeService.invite(email);
  }

  // Endpoint to request a password reset (forgot password)
  // POST /authentication/forgot-password
  @Post("forgot-password")
  @ApiQuery({
    name: "email",
    required: true,
    type: String,
    description: "The email address of the user requesting password reset",
    example: "user@example.com",
  })
  async forgotPassword(@Query("email") email: string) {
    // This should trigger sending a reset password code to the user's email
    return this.resetPasswordCodeService.resetPassword(email);
  }

  /* Intentional No Guard */
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  /* Intentional No Guard */
  @Post("register/:inviteCode")
  async register(
    @Param("inviteCode") inviteCode: string,
    @Body() registerDto: RegisterDto,
  ) {
    return this.authenticationService.register(inviteCode, registerDto);
  }

  @Post("reset-password/:resetPasswordCode")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        newPassword: {
          type: "string",
          example: "newStrongPassword123!",
          description: "The new password to set for the user",
        },
      },
      required: ["newPassword"],
    },
  })
  async resetPassword(
    @Param("resetPasswordCode") resetPasswordCode: string,
    @Body("newPassword") newPassword: string,
  ) {
    return this.authenticationService.resetPassword(
      resetPasswordCode,
      newPassword,
    );
  }

  // Endpoint to refresh tokens
  // POST /authentication/refresh-token
  @Post("refresh-token")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        refreshToken: {
          type: "string",
          example: "your_refresh_token_here",
          description:
            "The refresh token to obtain new access and refresh tokens",
        },
      },
      required: ["refreshToken"],
    },
  })
  async refreshToken(@Body("refreshToken") refreshToken: string) {
    return this.authenticationService.refreshToken(refreshToken);
  }
}
