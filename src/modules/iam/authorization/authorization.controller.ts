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
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { RequirePermission } from "./decorators/permission.decorator";
import { PermissionGuard } from "./guards/permission.guard";
import { RoleService } from "./role.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("authorization")
export class AuthorizationController {
  constructor(private readonly roleService: RoleService) {}

  @RequirePermission(PermissionEnum.ROLE_READ_ALL)
  @Get("roles")
  async getAllRoles() {
    return this.roleService.findAll();
  }

  @RequirePermission(PermissionEnum.ROLE_READ_ONE)
  @Get("roles/:id")
  async getRoleById(@Param("id") id: string) {
    return this.roleService.findOne(id);
  }

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

  @RequirePermission(PermissionEnum.ROLE_DELETE)
  @Delete("roles/:id")
  async deleteRole(@Param("id") id: string) {
    return this.roleService.delete(id);
  }

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
