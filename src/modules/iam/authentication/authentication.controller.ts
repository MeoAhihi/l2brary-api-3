import { PermissionEnum } from "@/common/permission.enum";

import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery , ApiOperation } from "@nestjs/swagger";

import { RequirePermission } from "../authorization/decorators/permission.decorator";
import { PermissionGuard } from "../authorization/guards/permission.guard";
import { AuthRequest } from "../types/auth-request.type";
import { AuthenticationService } from "./authentication.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
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

  @ApiOperation({ 
    summary: "Generate invite code", 
    description: "Generate an invite code for user registration. Requires admin permissions.",
    tags: ["Authentication"]
  })
  @ApiBearerAuth()
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

  @ApiOperation({ 
    summary: "Request password reset", 
    description: "Request a password reset code to be sent to the user's email. No authentication required.",
    tags: ["Authentication"]
  })
  /* Intentional No Guard */
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

  @ApiOperation({ 
    summary: "User login", 
    description: "Authenticate user with email and password. No authentication required.",
    tags: ["Authentication"]
  })
  /* Intentional No Guard */
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @ApiOperation({ 
    summary: "User registration", 
    description: "Register a new user with an invite code. No authentication required.",
    tags: ["Authentication"]
  })
  /* Intentional No Guard */
  @Post("register/:inviteCode")
  async register(
    @Param("inviteCode") inviteCode: string,
    @Body() registerDto: RegisterDto,
  ) {
    return this.authenticationService.register(inviteCode, registerDto);
  }

  @ApiOperation({ 
    summary: "Reset password", 
    description: "Reset user password using a reset code. No authentication required.",
    tags: ["Authentication"]
  })
  /* Intentional No Guard */
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

  @ApiOperation({ 
    summary: "Change password", 
    description: "Change the current user's password. Requires JWT authentication.",
    tags: ["Authentication"]
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("change-password")
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: AuthRequest,
  ) {
    // Assumes req.user.sub contains the user ID (populated by authentication guard)
    return this.authenticationService.changePassword(
      req.user.sub,
      changePasswordDto,
    );
  }

  @ApiOperation({ 
    summary: "Refresh token", 
    description: "Obtain new access and refresh tokens using a refresh token. No authentication required.",
    tags: ["Authentication"]
  })
  /* Intentional No Guard */
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
