import { Body, Controller, Param, Post, Query } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { RegisterDto } from "./dto/register.dto";
import { ApiBody, ApiQuery } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { InviteCodeService } from "./invite-code.service";

@Controller("authentication")
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly inviteCodeService: InviteCodeService
  ) {}

  // Endpoint to generate an invite code, optionally with an email
  // POST /authentication/invite
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

  // Endpoint to login a user with phone number and password
  // POST /authentication/login
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  // Endpoint to register a new user with invite code and registration data
  // POST /authentication/register
  @Post("register/:inviteCode")
  async register(
    @Param("inviteCode") inviteCode: string,
    @Body() registerDto: RegisterDto
  ) {
    return this.authenticationService.register(inviteCode, registerDto);
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
