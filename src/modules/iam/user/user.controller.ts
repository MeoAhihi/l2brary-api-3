import { PermissionEnum } from "@/common/permission.enum";
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
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery } from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { RequirePermission } from "../authorization/decorators/permission.decorator";
import { PermissionGuard } from "../authorization/guards/permission.guard";
import { AuthPayload } from "../types/auth-payload.interface";
import { AuthRequest } from "../types/auth-request.type";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);
    return plainToInstance(User, newUser, { excludeExtraneousValues: true });
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_READ_MANY)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @ApiQuery({
    name: "gender",
    required: false,
    type: String,
    description: "Filter users by gender",
  })
  @ApiQuery({
    name: "ranks",
    required: false,
    type: [String],
    description: "Filter users by an array of ranks",
  })
  @ApiQuery({
    name: "sortByRank",
    required: false,
    type: Boolean,
    description: "Sort users by rank in ascending order",
    example: true,
    default: false,
    allowEmptyValue: true,
  })
  @Get()
  async findMany(
    @Query("gender") gender?: string,
    @Query("ranks") ranks?: string[],
    @Query("sortByRank") sortByRank?: boolean,
  ): Promise<User[]> {
    const users = await this.userService.findAll({
      gender,
      ranks,
      sortByRank,
    });
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("profile")
  async getProfile(@Req() req: AuthRequest) {
    return await this.userService.findOne(req.user.sub, ["roles"]);
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_READ_ONE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<User> {
    return await this.userService.findOne(id, ["roles"]);
  }

  @ApiOperation({ summary: "Admin modify user profile" })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
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

  @ApiOperation({ summary: "User modify self profile" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateProfile(
    @Req() req: AuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const updatedUser = await this.userService.update(
      req.user.sub,
      updateProfileDto,
    );
    return plainToInstance(User, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_OFFBOARD)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(":id")
  async offboard(@Param("id") id: string): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: `User with id ${id} has been deleted.` };
  }

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_ASSIGN_ROLE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
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

  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_UNASSIGN_ROLE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
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
