import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PermissionEnum } from "src/common/permission.enum";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { Repository } from "typeorm";
@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  async onModuleInit() {
    const enumPermissionNames = this.getEnumPermissionNames();
    const dbPermissions = await this.findAll();
    const dbPermissionNames = dbPermissions.map((perm) => perm.name);

    const permissionsToDelete = this.findPermissionsToDelete(
      dbPermissions,
      enumPermissionNames
    );
    const permissionsToAdd = this.findPermissionsToAdd(
      enumPermissionNames,
      dbPermissionNames
    );

    await this.deletePermissions(permissionsToDelete);
    await this.addPermissions(permissionsToAdd);
  }

  private getEnumPermissionNames(): string[] {
    return Object.values(PermissionEnum);
  }

  async findAll(roleIds?: string[]): Promise<Permission[]> {
    if (!roleIds || roleIds.length === 0) {
      return this.permissionRepository.find();
    }
    return this.permissionRepository
      .createQueryBuilder("permission")
      .leftJoinAndSelect("permission.roles", "role")
      .where("role.id IN (:...roleIds)", { roleIds })
      .getMany();
  }

  private findPermissionsToDelete(
    dbPermissions: Permission[],
    enumPermissionNames: string[]
  ): Permission[] {
    return dbPermissions.filter(
      (perm) => !enumPermissionNames.includes(perm.name)
    );
  }

  private findPermissionsToAdd(
    enumPermissionNames: string[],
    dbPermissionNames: string[]
  ): string[] {
    return enumPermissionNames.filter(
      (name) => !dbPermissionNames.includes(name)
    );
  }

  private async deletePermissions(
    permissionsToDelete: Permission[]
  ): Promise<void> {
    if (permissionsToDelete.length > 0) {
      await this.permissionRepository.remove(permissionsToDelete);
    }
  }

  private async addPermissions(permissionsToAdd: string[]): Promise<void> {
    if (permissionsToAdd.length > 0) {
      const newPermissions = permissionsToAdd.map((name) => {
        return this.permissionRepository.create({ name });
      });
      await this.permissionRepository.save(newPermissions);
    }
  }
}
