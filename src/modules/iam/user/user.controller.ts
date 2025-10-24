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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { RequirePermission } from "../authorization/decorators/permission.decorator";
import { PermissionGuard } from "../authorization/guards/permission.guard";
import { AuthRequest } from "../types/auth-request.type";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: "Get all users",
    description:
      "Retrieve a list of all users with optional filtering. Requires admin permissions.",
    tags: ["User Management"],
  })
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
  @ApiOkResponse({
    description: "",
    example: {
      items: [
        {
          id: "e9f9a456-1930-43d9-aba9-b60a8cc1a7ec",
          avatarUrl:
            "https://img.freepik.com/free-vector/businesswoman-character-avatar-isolated_24877-60111.jpg",
          fullName: "Jane Smith",
          internationalName: "JANE SMITH",
          gender: "female",
          birthdate: "1992-05-11",
          phoneNumber: "+1234567890",
          email: "user@example.com",
          rank: "member",
          courseCertificates: ["CERT-C1", "CERT-C2"],
          eventCertificates: ["CERT-E1"],
          experiences: ["experience-1", "experience-2"],
          createdAt: "2024-03-01T13:24:32.150Z",
          updatedAt: "2024-04-22T15:14:12.670Z",
          roles: [],
        },
      ],
      total: 36,
      page: 1,
      limit: 20,
      pageCount: 2,
    },
  })
  @Get()
  @ApiQuery({
    name: "fullName",
    required: false,
    type: String,
    description: "Page number for pagination (default: 1)",
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: "experiences",
    required: false,
    type: String,
    description: "Filter users by experience keyword(s)",
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: "courseCertificates",
    required: false,
    type: String,
    description:
      "Filter users by course certificates (array of certificate IDs or names)",
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: "eventCertificates",
    required: false,
    type: String,
    description:
      "Filter users by event certificates (array of certificate IDs or names)",
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number for pagination (default: 1)",
    example: 1,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of users per page (default: 20)",
    example: 20,
    allowEmptyValue: true,
  })
  async findMany(
    @Query("gender") gender?: string,
    @Query("fullName") fullName?: string,
    @Query("ranks") ranks?: string[],
    @Query("experiences") experiences?: string,
    @Query("courseCertificates") courseCertificates?: string,
    @Query("eventCertificates") eventCertificates?: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 0,
  ): Promise<{
    items: User[];
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  }> {
    const { items, total, pageCount } = await this.userService.findAll({
      fullName,
      gender,
      ranks,
      experiences,
      courseCertificates,
      eventCertificates,
      page,
      limit,
    });
    return {
      items,
      total,
      page,
      limit,
      pageCount,
    };
  }

  @ApiOperation({
    summary: "Get user profile",
    description:
      "Retrieve the current user's profile information. Requires JWT authentication.",
    tags: ["User Profile"],
  })
  @ApiOkResponse({
    schema: {
      example: {
        id: "367276c4-f513-4331-86fe-be31f488960c",
        avatarUrl: "",
        fullName: "Johny Doe",
        internationalName: "J. Doe",
        gender: "male",
        birthdate: "2000-01-01",
        phoneNumber: "0123456789",
        email: "johny.doe@example.com",
        rank: "Junior",
        courseCertificates: [
          "Chuyên đề Vật lý hiện đại",
          "Thực hành Quang học",
          "Hội thảo Vật lý lượng tử",
          "Workshop Điện từ học",
          "Khóa học Cơ học cổ điển",
          "Thí nghiệm Vật lý hạt nhân",
          "Chuyên đề Vật lý thiên văn",
        ],
        eventCertificates: [
          "Hội thảo Khoa học",
          "Seminar Vật lý ứng dụng",
          "Hội nghị Nghiên cứu trẻ",
          "Workshop STEM",
          "Hội thảo Công nghệ mới",
          "Seminar Đổi mới sáng tạo",
          "Hội thảo Giáo dục",
        ],
        experiences: [
          "Olympic Vật lý",
          "Thực tập lab",
          "CLB Vật lý",
          "Trợ giảng",
          "Hội thảo",
          "Nghiên cứu",
          "Tình nguyện",
        ],
        createdAt: "2025-09-22T15:45:20.635Z",
        updatedAt: "2025-10-02T07:42:39.562Z",
        roles: [
          {
            id: "5361c117-b4d1-41f3-951f-6fbbc681f5de",
            name: "member",
            description: null,
          },
          {
            id: "764a95e4-a113-4936-8e9e-b22c193a60ba",
            name: "monitor",
            description: null,
          },
          {
            id: "ed8152ae-94cb-4b01-a398-5a048db5c914",
            name: "admin",
            description: null,
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("profile")
  async getProfile(@Req() req: AuthRequest) {
    return await this.userService.findOne(req.user.sub, ["roles"]);
  }

  @ApiOperation({
    summary: "Get user by ID",
    description:
      "Retrieve a specific user by their ID. Requires admin permissions.",
    tags: ["User Management"],
  })
  @ApiOkResponse({
    schema: {
      example: {
        id: "367276c4-f513-4331-86fe-be31f488960c",
        avatarUrl: "",
        fullName: "Johny Doe",
        internationalName: "J. Doe",
        gender: "male",
        birthdate: "2000-01-01",
        phoneNumber: "0123456789",
        email: "johny.doe@example.com",
        rank: "Junior",
        courseCertificates: [
          "Chuyên đề Vật lý hiện đại",
          "Thực hành Quang học",
          "Hội thảo Vật lý lượng tử",
          "Workshop Điện từ học",
          "Khóa học Cơ học cổ điển",
          "Thí nghiệm Vật lý hạt nhân",
          "Chuyên đề Vật lý thiên văn",
        ],
        eventCertificates: [
          "Hội thảo Khoa học",
          "Seminar Vật lý ứng dụng",
          "Hội nghị Nghiên cứu trẻ",
          "Workshop STEM",
          "Hội thảo Công nghệ mới",
          "Seminar Đổi mới sáng tạo",
          "Hội thảo Giáo dục",
        ],
        experiences: [
          "Olympic Vật lý",
          "Thực tập lab",
          "CLB Vật lý",
          "Trợ giảng",
          "Hội thảo",
          "Nghiên cứu",
          "Tình nguyện",
        ],
        createdAt: "2025-09-22T15:45:20.635Z",
        updatedAt: "2025-10-02T07:42:39.562Z",
        roles: [
          {
            id: "5361c117-b4d1-41f3-951f-6fbbc681f5de",
            name: "member",
            description: null,
          },
          {
            id: "764a95e4-a113-4936-8e9e-b22c193a60ba",
            name: "monitor",
            description: null,
          },
          {
            id: "ed8152ae-94cb-4b01-a398-5a048db5c914",
            name: "admin",
            description: null,
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_READ_ONE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<User> {
    return await this.userService.findOne(id, ["roles"]);
  }

  @ApiOperation({
    summary: "Admin modify user profile",
    description:
      "Update a user's profile information. Requires admin permissions.",
    tags: ["User Management"],
  })
  @ApiOkResponse({
    example: {
      id: "367276c4-f513-4331-86fe-be31f488960c",
      avatarUrl: "",
      fullName: "Johny Doe",
      internationalName: "J. Doe",
      gender: "male",
      birthdate: "2000-01-01",
      phoneNumber: "0123456789",
      email: "johny.doe@example.com",
      rank: "Junior",
      courseCertificates: [
        "Chuyên đề Vật lý hiện đại",
        "Thực hành Quang học",
        "Hội thảo Vật lý lượng tử",
        "Workshop Điện từ học",
        "Khóa học Cơ học cổ điển",
        "Thí nghiệm Vật lý hạt nhân",
        "Chuyên đề Vật lý thiên văn",
      ],
      eventCertificates: [
        "Hội thảo Khoa học",
        "Seminar Vật lý ứng dụng",
        "Hội nghị Nghiên cứu trẻ",
        "Workshop STEM",
        "Hội thảo Công nghệ mới",
        "Seminar Đổi mới sáng tạo",
        "Hội thảo Giáo dục",
      ],
      experiences: [
        "Olympic Vật lý",
        "Thực tập lab",
        "CLB Vật lý",
        "Trợ giảng",
        "Hội thảo",
        "Nghiên cứu",
        "Tình nguyện",
      ],
      createdAt: "2025-09-22T15:45:20.635Z",
      updatedAt: "2025-10-11T05:07:23.226Z",
    },
  })
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

  @ApiOperation({
    summary: "User modify self profile",
    description:
      "Update the current user's own profile information. Requires JWT authentication.",
    tags: ["User Profile"],
  })
  @ApiOkResponse({
    example: {
      id: "367276c4-f513-4331-86fe-be31f488960c",
      avatarUrl: "",
      fullName: "Johny Doe",
      internationalName: "J. Doe",
      gender: "male",
      birthdate: "2000-01-01",
      phoneNumber: "0123456789",
      email: "johny.doe@example.com",
      rank: "Junior",
      courseCertificates: [
        "Chuyên đề Vật lý hiện đại",
        "Thực hành Quang học",
        "Hội thảo Vật lý lượng tử",
        "Workshop Điện từ học",
        "Khóa học Cơ học cổ điển",
        "Thí nghiệm Vật lý hạt nhân",
        "Chuyên đề Vật lý thiên văn",
      ],
      eventCertificates: [
        "Hội thảo Khoa học",
        "Seminar Vật lý ứng dụng",
        "Hội nghị Nghiên cứu trẻ",
        "Workshop STEM",
        "Hội thảo Công nghệ mới",
        "Seminar Đổi mới sáng tạo",
        "Hội thảo Giáo dục",
      ],
      experiences: [
        "Olympic Vật lý",
        "Thực tập lab",
        "CLB Vật lý",
        "Trợ giảng",
        "Hội thảo",
        "Nghiên cứu",
        "Tình nguyện",
      ],
      createdAt: "2025-09-22T15:45:20.635Z",
      updatedAt: "2025-10-11T05:07:23.226Z",
    },
  })
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

  @ApiOperation({
    summary: "Delete user",
    description: "Remove a user from the system. Requires admin permissions.",
    tags: ["User Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_OFFBOARD)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(":id")
  async offboard(@Param("id") id: string): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: `User with id ${id} has been deleted.` };
  }

  @ApiOperation({
    summary: "Assign role to user",
    description: "Assign a role to a user. Requires admin permissions.",
    tags: ["User Management"],
  })
  @ApiCreatedResponse({
    example: {
      message: 'Role "member" assigned from user "Johny Doe" successfully',
    },
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_ASSIGN_ROLE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post(":id/roles/:roleId/assign")
  async assignRole(
    @Param("id") userId: string,
    @Param("roleId") roleId: string,
  ): Promise<{ message: string }> {
    return this.userService.assignRole(userId, roleId);
  }

  @ApiOperation({
    summary: "Unassign role from user",
    description: "Remove a role from a user. Requires admin permissions.",
    tags: ["User Management"],
  })
  @ApiCreatedResponse({
    example: {
      message: 'Role "member" unassigned from user "Johny Doe" successfully',
    },
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.USER_UNASSIGN_ROLE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post(":id/roles/:roleId/unassign")
  async unassignRole(
    @Param("id") userId: string,
    @Param("roleId") roleId: string,
  ): Promise<{ message: string }> {
    return this.userService.unassignRole(userId, roleId);
  }

  @ApiOperation({
    summary: "Get all distinct experiences from users",
    description: "Returns all unique experiences found in user records.",
    tags: ["User Management"],
  })
  @ApiOkResponse({
    schema: {
      example: ["experience-1", "experience-2", "researcher", "mentor"],
    },
  })
  @Get("distinct/experiences")
  async getAllDistinctExperiences(): Promise<string[]> {
    return this.userService.getAllDistinctExperiences();
  }

  @ApiOperation({
    summary: "Get all distinct event certificates from users",
    description: "Returns all unique event certificates found in user records.",
    tags: ["User Management"],
  })
  @ApiOkResponse({
    schema: {
      example: [
        "Hội thảo Khoa học",
        "Seminar Vật lý ứng dụng",
        "Hội nghị Nghiên cứu trẻ",
        "Workshop STEM",
      ],
    },
  })
  @Get("distinct/event-certificates")
  async getAllDistinctEventCertificates(): Promise<string[]> {
    return this.userService.getAllDistinctEventCertificates();
  }

  @ApiOperation({
    summary: "Get all distinct course certificates from users",
    description:
      "Returns all unique course certificates found in user records.",
    tags: ["User Management"],
  })
  @ApiOkResponse({
    schema: {
      example: [
        "Chuyên đề Vật lý hiện đại",
        "Thực hành Quang học",
        "Hội thảo Vật lý lượng tử",
        "Workshop Điện từ học",
      ],
    },
  })
  @Get("distinct/course-certificates")
  async getAllDistinctCourseCertificates(): Promise<string[]> {
    return this.userService.getAllDistinctCourseCertificates();
  }
}
