import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./modules/iam/authentication/guards/jwt.guard";
import { AuthRequest } from "./modules/iam/types/auth-request.type";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ 
    summary: "Get application status", 
    description: "Retrieve application status and user information. Requires JWT authentication.",
    tags: ["Application"]
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() req: AuthRequest): Promise<string> {
    return this.appService.getHello(req.user.sub);
  }
}
