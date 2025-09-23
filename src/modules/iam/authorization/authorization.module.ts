import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { AuthorizationController } from "./authorization.controller";
import { Permission } from "./entities/permission.entity";
import { Role } from "./entities/role.entity";
import { PermissionService } from "./permission.service";
import { RoleService } from "./role.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [AuthorizationController],
  providers: [PermissionService, RoleService],
  exports: [RoleService, PermissionService],
})
export class AuthorizationModule {}
