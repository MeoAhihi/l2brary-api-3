import { PermissionEnum } from "@/common/permission.enum";

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { RequirePermission } from "./decorators/permission.decorator";
import { AttachPermissionDto } from "./dto/attach-permission.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { DetachPermissionDto } from "./dto/detach-permission.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entity";
import { PermissionGuard } from "./guards/permission.guard";
import { PermissionService } from "./permission.service";
import { RoleService } from "./role.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("authorization")
export class AuthorizationController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  @ApiOperation({
    summary: "Get all permissions",
    description: "Retrieve a list of all available permissions.",
    tags: ["Authorization"],
  })
  @ApiQuery({
    name: "attachRoles",
    required: false,
    type: "boolean",
    description:
      "If true, include roles associated with each permission in the response. Defaults to false.",
    example: true,
  })
  @ApiOkResponse({
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "e49e9872-9a06-4bde-a789-71a0a3933433",
          },
          name: { type: "string", example: "enrollment:update" },
        },
      },
    },
  })
  @RequirePermission(PermissionEnum.ROLE_READ_ALL)
  @Get("permissions")
  async getAllPermissions(
    @Query("attachRoles") attachRoles?: boolean | string,
  ) {
    const attach = attachRoles === true || attachRoles === "true";
    return this.permissionService.findAll({ attachRoles: attach });
  }

  @ApiOperation({
    summary: "Get all roles",
    description: "Retrieve a list of all roles. Requires admin permissions.",
    tags: ["Authorization"],
  })
  @ApiQuery({
    name: "permissions",
    required: false,
    type: "boolean",
    description:
      "If true, include the permissions for each role in the response. Defaults to false.",
    example: true,
  })
  @ApiOkResponse({
    type: Role,
    isArray: true,
  })
  @RequirePermission(PermissionEnum.ROLE_READ_ALL)
  @Get("roles")
  async getAllRoles(
    @Query("permissions") includePermissions?: boolean | string,
  ) {
    return this.roleService.findAll({
      includePermissions:
        includePermissions === true || includePermissions === "true",
    });
  }

  @ApiOperation({
    summary: "Get role by ID",
    description:
      "Retrieve a specific role by its ID. Requires admin permissions.",
    tags: ["Authorization"],
  })
  @ApiOkResponse({
    example: {
      id: "764a95e4-a113-4936-8e9e-b22c193a60ba",
      name: "monitor",
      permissions: [
        {
          id: "e49e9872-9a06-4bde-a789-71a0a3933433",
          name: "enrollment:update",
        },
        {
          id: "d2db26f5-0999-4c47-a4ce-7bb375985f74",
          name: "enrollment:delete",
        },
        {
          id: "cfa1acb4-fb30-48ef-a83d-6fd8a817ac46",
          name: "game:create",
        },
      ],
      description: null,
    },
  })
  @RequirePermission(PermissionEnum.ROLE_READ_ONE)
  @Get("roles/:id")
  async getRoleById(@Param("id") id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({
    summary: "Create role",
    description: "Create a new role. Requires admin permissions.",
    tags: ["Authorization"],
  })
  @ApiCreatedResponse({
    type: Role,
  })
  @RequirePermission(PermissionEnum.ROLE_CREATE)
  @Post("roles")
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({
    summary: "Update role",
    description: "Update an existing role. Requires admin permissions.",
    tags: ["Authorization"],
  })
  @ApiOkResponse({
    example: {
      id: "764a95e4-a113-4936-8e9e-b22c193a60ba",
      name: "monitor",
      permissions: [
        {
          id: "e49e9872-9a06-4bde-a789-71a0a3933433",
          name: "enrollment:update",
        },
        {
          id: "d2db26f5-0999-4c47-a4ce-7bb375985f74",
          name: "enrollment:delete",
        },
        {
          id: "cfa1acb4-fb30-48ef-a83d-6fd8a817ac46",
          name: "game:create",
        },
      ],
      description: null,
    },
  })
  @RequirePermission(PermissionEnum.ROLE_UPDATE)
  @Patch("roles/:id")
  async updateRole(
    @Param("id") id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiOperation({
    summary: "Delete role",
    description: "Delete a role. Requires admin permissions.",
    tags: ["Authorization"],
  })
  @RequirePermission(PermissionEnum.ROLE_DELETE)
  @Delete("roles/:id")
  async deleteRole(@Param("id") id: string) {
    return this.roleService.delete(id);
  }

  @ApiOperation({
    summary: "Attach permissions to role",
    description: "Attach permissions to a role. Requires admin permissions.",
    tags: ["Authorization"],
  })
  @ApiCreatedResponse({
    example: {
      id: "764a95e4-a113-4936-8e9e-b22c193a60ba",
      name: "monitor",
      permissions: [
        {
          id: "e49e9872-9a06-4bde-a789-71a0a3933433",
          name: "enrollment:update",
        },
        {
          id: "d2db26f5-0999-4c47-a4ce-7bb375985f74",
          name: "enrollment:delete",
        },
        {
          id: "cfa1acb4-fb30-48ef-a83d-6fd8a817ac46",
          name: "game:create",
        },
      ],
      description: null,
    },
  })
  @RequirePermission(PermissionEnum.ROLE_ATTACH_PERMISSIONS)
  @Post("roles/:roleId/permissions/attach")
  async attachPermissionsToRole(
    @Param("roleId") roleId: string,
    @Body() attachPermissionDto: AttachPermissionDto,
  ) {
    if (attachPermissionDto.permissionIds) {
      return this.roleService.attachPermissionIds(
        roleId,
        attachPermissionDto.permissionIds,
      );
    }
    if (attachPermissionDto.permissionNames) {
      return this.roleService.attachPermissionNames(
        roleId,
        attachPermissionDto.permissionNames,
      );
    }
    throw new BadRequestException("No permission IDs or names provided");
  }

  @ApiOperation({
    summary: "Detach permissions from role",
    description: "Detach permissions from a role. Requires admin permissions.",
    tags: ["Authorization"],
  })
  @ApiCreatedResponse({
    example: {
      id: "764a95e4-a113-4936-8e9e-b22c193a60ba",
      name: "monitor",
      permissions: [
        {
          id: "e49e9872-9a06-4bde-a789-71a0a3933433",
          name: "enrollment:update",
        },
        {
          id: "d2db26f5-0999-4c47-a4ce-7bb375985f74",
          name: "enrollment:delete",
        },
        {
          id: "cfa1acb4-fb30-48ef-a83d-6fd8a817ac46",
          name: "game:create",
        },
      ],
      description: null,
    },
  })
  @RequirePermission(PermissionEnum.ROLE_DETACH_PERMISSIONS)
  @Post("roles/:roleId/permissions/detach")
  async detachPermissionsFromRole(
    @Param("roleId") roleId: string,
    @Body() detachPermissionDto: DetachPermissionDto,
  ) {
    return this.roleService.detachPermissions(
      roleId,
      detachPermissionDto.permissionIds,
    );
  }
}
