import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AppService } from "./app.service";
import { JwtAuthGuard } from "./modules/iam/authentication/guards/jwt.guard";
import { AuthRequest } from "./modules/iam/types/auth-request.type";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() req: AuthRequest): Promise<string> {
    return this.appService.getHello(req.user.sub);
  }
}
