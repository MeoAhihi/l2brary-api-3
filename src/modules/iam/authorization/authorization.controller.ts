import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";

import { PermissionService } from "./permission.service";
import { RoleService } from "./role.service";

@Controller("authorization")
export class AuthorizationController {
  constructor(private readonly roleService: RoleService) {}

  @Get("roles")
  async getAllRoles() {
    return this.roleService.findAll();
  }

  @Get("roles/:id")
  async getRoleById(@Param("id") id: string) {
    return this.roleService.findOne(id);
  }

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

  // Example: DELETE /authorization/roles/:id
  @Delete("roles/:id")
  async deleteRole(@Param("id") id: string) {
    return this.roleService.delete(id);
  }

  // Attach permissions to a role
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

  // Detach permissions from a role
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
