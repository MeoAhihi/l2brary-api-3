import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(name: string): Promise<Role> {
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
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

  async rename(id: string, newName: string): Promise<Role> {
    const role = await this.findOne(id);
    role.name = newName;
    return this.roleRepository.save(role);
  }

  async attachPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    const role = await this.findOne(roleId);

    // Avoid duplicates: only add permissions not already present
    const existingPermissionIds = new Set(
      (role.permissions || []).map((p) => p.id)
    );
    const newPermissionIds = permissionIds.filter(
      (id) => !existingPermissionIds.has(id)
    );
    const permissions = await this.permissionRepository.find({
      where: { id: In(newPermissionIds) },
    });

    role.permissions.push(...permissions);

    return this.roleRepository.save(role);
  }

  async detachPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    const role = await this.findOne(roleId);
    role.permissions = (role.permissions || []).filter(
      (perm) => !permissionIds.includes(perm.id)
    );
    return this.roleRepository.save(role);
  }

  async delete(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
