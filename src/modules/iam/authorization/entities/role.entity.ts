import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { User } from "../../user/entities/user.entity";
import { Permission } from "./permission.entity";

@Entity()
export class Role {
  @ApiProperty({
    type: String,
    format: "uuid",
    example: "5361c117-b4d1-41f3-951f-6fbbc681f5de",
    description: "Unique identifier for the role",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "admin",
    description: "The name of the role",
  })
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];

  @ApiPropertyOptional({
    example: "Role for platform administrators",
    description: "A short description of the role",
    nullable: true,
  })
  @Column({ nullable: true })
  description?: string;
}
