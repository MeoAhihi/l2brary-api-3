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
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { RequirePermission } from "./decorators/permission.decorator";
import { AttachPermissionDto } from "./dto/attach-permission.dto";
import { DetachPermissionDto } from "./dto/detach-permission.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { PermissionGuard } from "./guards/permission.guard";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("authorization")
export class AuthorizationController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: "Get all roles",
    description: "Retrieve a list of all roles. Requires admin permissions.",
    tags: ["Authorization"],
  })
  @RequirePermission(PermissionEnum.ROLE_READ_ALL)
  @Get("roles")
  async getAllRoles() {
    return this.roleService.findAll();
  }

  @ApiOperation({
    summary: "Get role by ID",
    description:
      "Retrieve a specific role by its ID. Requires admin permissions.",
    tags: ["Authorization"],
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
