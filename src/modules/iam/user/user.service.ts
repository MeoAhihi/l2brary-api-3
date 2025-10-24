import { compareSync, hash, hashSync } from "bcrypt";
import { In, Repository } from "typeorm";

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { RoleService } from "../authorization/role.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // RoleService injection for role management
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check for duplicate phone
    const existingUser = await this.findByPhoneNumber(
      createUserDto.phoneNumber,
    );
    if (existingUser) {
      throw new ConflictException(
        `User with phone number ${createUserDto.phoneNumber} already exists`,
      );
    }

    const saltRounds = 10;
    const hashedPassword = await hash(createUserDto.password, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.userRepository.save(user);
  }

  async findAll(options?: {
    ids?: string[];
    fullName?: string;
    gender?: string;
    ranks?: string[];
    courseCertificates?: string;
    eventCertificates?: string;
    experiences?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: User[];
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  }> {
    const where: any = {};

    // Use QueryBuilder for flexible filtering and relation loading
    const qb = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role");

    if (options?.ids && options.ids.length > 0) {
      qb.andWhere("user.id IN (:...ids)", { ids: options.ids });
    }

    if (options?.fullName)
      qb.andWhere(
        'unaccent(lower("user"."fullName")) LIKE unaccent(lower(:fullName))',
        {
          fullName: `%${options?.fullName}%`,
        },
      );

    if (options?.gender) {
      qb.andWhere("user.gender = :gender", { gender: options.gender });
    }

    if (options?.ranks && !Array.isArray(options.ranks)) {
      options.ranks = [options.ranks];
    } else if (options?.ranks && typeof options.ranks === "string") {
      options.ranks = [options.ranks];
    }
    if (
      options?.ranks &&
      Array.isArray(options.ranks) &&
      options.ranks.length > 0
    ) {
      qb.andWhere("user.rank IN (:...ranks)", { ranks: options.ranks });
    }

    if (options?.experiences)
      qb.andWhere(
        'unaccent(lower("user"."experiences")) LIKE unaccent(lower(:exp))',
        {
          exp: `%${options?.experiences}%`,
        },
      );

    if (options?.courseCertificates)
      qb.andWhere(
        'unaccent(lower("user"."courseCertificates")) LIKE unaccent(lower(:course))',
        {
          course: `%${options?.courseCertificates}%`,
        },
      );

    if (options?.eventCertificates)
      qb.andWhere(
        'unaccent(lower("user"."eventCertificates")) LIKE unaccent(lower(:event))',
        {
          event: `%${options?.eventCertificates}%`,
        },
      );

    // Pagination
    let page = options?.page ?? 1;
    let limit = options?.limit ?? 0;
    if (limit > 0) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [items, total] = await qb.getManyAndCount();
    const pageCount = limit > 0 ? Math.ceil(total / limit) : 1;
    return { items, page, total, limit, pageCount };
  }

  async findOne(
    id: string,
    relations?: ("roles" | "articles" | "activityLogs")[],
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    user.updatedAt = new Date();
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }

  async assignRole(
    userId: string,
    roleId: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["roles"],
    });

    // Check if user exists
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Find the role entity
    const role = await this.roleService.findOne(roleId);

    // Check if the user already has the role
    if (!user.roles.some((r) => r.id === role.id)) {
      // Role already assigned, do nothing or throw if you want
      user.roles.push(role);
    }

    // Save the updated user entity
    await this.userRepository.save(user);
    return {
      message: `Role "${role.name}" assigned to user "${user.fullName}" successfully`,
    };
  }

  async unassignRole(
    userId: string,
    roleId: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["roles"],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const roleToUnassign = user.roles.find((role) => role.id === roleId);
    // Remove the role from the user's roles array
    user.roles = (user.roles || []).filter((role) => role.id !== roleId);

    await this.userRepository.save(user);
    return {
      message: `Role "${roleToUnassign?.name}" unassigned from user "${user.fullName}" successfully`,
    };
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findOne(userId);

    // Hash new password and update
    const saltRounds = 10;
    const hashedPassword = hashSync(newPassword, saltRounds);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async getAllDistinctCourseCertificates(): Promise<string[]> {
    // Assumes the User entity has 'courseCertificates' as a comma-separated string
    const result = await this.userRepository
      .createQueryBuilder("u")
      .select(
        "DISTINCT UNNEST(string_to_array(u.\"courseCertificates\", ','))",
        "course",
      )
      .getRawMany();

    // result will be an array of objects with the shape { course: string }
    return result
      .map((row) => row.course)
      .filter((course) => !!course && course.trim().length > 0);
  }

  async getAllDistinctEventCertificates(): Promise<string[]> {
    // Assumes the User entity has 'eventCertificates' as a comma-separated string
    const result = await this.userRepository
      .createQueryBuilder("u")
      .select(
        "DISTINCT UNNEST(string_to_array(u.\"eventCertificates\", ','))",
        "event",
      )
      .getRawMany();

    // result will be an array of objects with the shape { event: string }
    return result
      .map((row) => row.event)
      .filter((event) => !!event && event.trim().length > 0);
  }

  async getAllDistinctExperiences(): Promise<string[]> {
    // Assumes the User entity has 'experiences' as a comma-separated string
    const result = await this.userRepository
      .createQueryBuilder("u")
      .select(
        "DISTINCT UNNEST(string_to_array(u.\"experiences\", ','))",
        "experience",
      )
      .getRawMany();

    // result: array of objects with the shape { experience: string }
    return result
      .map((row) => row.experience)
      .filter((exp) => !!exp && exp.trim().length > 0);
  }
}
