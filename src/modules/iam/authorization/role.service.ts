import { In, Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Permission } from "./entities/permission.entity";
import { Role } from "./entities/role.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(options?: { includePermissions?: boolean }): Promise<Role[]> {
    if (options?.includePermissions) {
      return this.roleRepository.find({ relations: ["permissions"] });
    }
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ["permissions"],
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async attachPermissionIds(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.findOne(roleId);

    // Avoid duplicates: only add permissions not already present
    const existingPermissionIds = new Set(
      (role.permissions || []).map((p) => p.id),
    );
    const newPermissionIds = permissionIds.filter(
      (id) => !existingPermissionIds.has(id),
    );
    const permissions = await this.permissionRepository.find({
      where: { id: In(newPermissionIds) },
    });

    role.permissions.push(...permissions);

    return this.roleRepository.save(role);
  }

  async attachPermissionNames(
    roleId: string,
    permissionNames: string[],
  ): Promise<Role> {
    const role = await this.findOne(roleId);

    // Avoid duplicates: only add permissions not already present
    const existingPermissionNames = new Set(
      (role.permissions || []).map((p) => p.name),
    );
    const newPermissionNames = permissionNames.filter(
      (name) => !existingPermissionNames.has(name),
    );
    if (newPermissionNames.length === 0) {
      return role;
    }
    const permissions = await this.permissionRepository.find({
      where: { name: In(newPermissionNames) },
    });

    role.permissions.push(...permissions);

    return this.roleRepository.save(role);
  }

  async detachPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.findOne(roleId);
    role.permissions = (role.permissions || []).filter(
      (perm) => !permissionIds.includes(perm.id),
    );
    return this.roleRepository.save(role);
  }

  async delete(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
