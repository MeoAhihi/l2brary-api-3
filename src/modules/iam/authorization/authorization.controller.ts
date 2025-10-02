import { PermissionEnum } from "@/common/permission.enum";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody , ApiOperation } from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { RequirePermission } from "./decorators/permission.decorator";
import { PermissionGuard } from "./guards/permission.guard";
import { RoleService } from "./role.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("authorization")
export class AuthorizationController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ 
    summary: "Get all roles", 
    description: "Retrieve a list of all roles. Requires admin permissions.",
    tags: ["Authorization"]
  })
  @RequirePermission(PermissionEnum.ROLE_READ_ALL)
  @Get("roles")
  async getAllRoles() {
    return this.roleService.findAll();
  }

  @ApiOperation({ 
    summary: "Get role by ID", 
    description: "Retrieve a specific role by its ID. Requires admin permissions.",
    tags: ["Authorization"]
  })
  @RequirePermission(PermissionEnum.ROLE_READ_ONE)
  @Get("roles/:id")
  async getRoleById(@Param("id") id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({ 
    summary: "Create role", 
    description: "Create a new role. Requires admin permissions.",
    tags: ["Authorization"]
  })
  @RequirePermission(PermissionEnum.ROLE_CREATE)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
  })
  @Post("roles")
  async createRole(@Body() createRoleDto: { name: string }) {
    return this.roleService.create(createRoleDto.name);
  }

  @ApiOperation({ 
    summary: "Update role", 
    description: "Update an existing role. Requires admin permissions.",
    tags: ["Authorization"]
  })
  @RequirePermission(PermissionEnum.ROLE_UPDATE)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
  })
  @Patch("roles/:id")
  async updateRole(
    @Param("id") id: string,
    @Body() updateRoleDto: { name: string },
  ) {
    return this.roleService.rename(id, updateRoleDto.name);
  }

  @ApiOperation({ 
    summary: "Delete role", 
    description: "Delete a role. Requires admin permissions.",
    tags: ["Authorization"]
  })
  @RequirePermission(PermissionEnum.ROLE_DELETE)
  @Delete("roles/:id")
  async deleteRole(@Param("id") id: string) {
    return this.roleService.delete(id);
  }

  @ApiOperation({ 
    summary: "Attach permissions to role", 
    description: "Attach permissions to a role. Requires admin permissions.",
    tags: ["Authorization"]
  })
  @RequirePermission(PermissionEnum.ROLE_ATTACH_PERMISSIONS)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        permissionIds: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["permissionIds"],
    },
  })
  @Post("roles/:roleId/permissions/attach")
  async attachPermissionsToRole(
    @Param("roleId") roleId: string,
    @Body("permissionIds") permissionIds: string[],
  ) {
    return this.roleService.attachPermissions(roleId, permissionIds);
  }

  @ApiOperation({ 
    summary: "Detach permissions from role", 
    description: "Detach permissions from a role. Requires admin permissions.",
    tags: ["Authorization"]
  })
  @RequirePermission(PermissionEnum.ROLE_DETACH_PERMISSIONS)
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        permissionIds: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["permissionIds"],
    },
  })
  @Post("roles/:roleId/permissions/detach")
  async detachPermissionsFromRole(
    @Param("roleId") roleId: string,
    @Body("permissionIds") permissionIds: string[],
  ) {
    return this.roleService.detachPermissions(roleId, permissionIds);
  }
}
