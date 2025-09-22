import { Module } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { AuthorizationController } from "./authorization.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { RoleService } from "./role.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [AuthorizationController],
  providers: [PermissionService, RoleService],
  exports: [RoleService],
})
export class AuthorizationModule {}
