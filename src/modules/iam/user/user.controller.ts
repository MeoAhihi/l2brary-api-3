import { plainToInstance } from "class-transformer";

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { AuthRequest } from "../types/auth-request.type";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);
    return plainToInstance(User, newUser, { excludeExtraneousValues: true });
  }

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("profile")
  async getProfile(@Req() req: AuthRequest) {
    return await this.userService.findOne(req.user.sub, ["roles"]);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<User> {
    return await this.userService.findOne(id, ["roles"]);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return plainToInstance(User, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: `User with id ${id} has been deleted.` };
  }

  @Post(":id/roles/:roleId/assign")
  async assignRole(
    @Param("id") userId: string,
    @Param("roleId") roleId: string,
  ): Promise<{ message: string }> {
    await this.userService.assignRole(userId, roleId);
    return {
      message: `Role with id ${roleId} assigned to user with id ${userId}.`,
    };
  }

  @Post(":id/roles/:roleId/unassign")
  async unassignRole(
    @Param("id") userId: string,
    @Param("roleId") roleId: string,
  ): Promise<{ message: string }> {
    await this.userService.unassignRole(userId, roleId);
    return {
      message: `Role with id ${roleId} unassigned from user with id ${userId}.`,
    };
  }
}
