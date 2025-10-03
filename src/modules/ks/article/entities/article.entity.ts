import { ReferenceUserDto } from "@/modules/iam/user/dto/reference-user.dto";
import { User } from "@/modules/iam/user/entities/user.entity";
import { Exclude, Expose, Type } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Article {
  @Expose()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @Column("text")
  content: string;

  @Expose()
  @ManyToOne(() => User, (user) => user.articles)
  @Type(() => ReferenceUserDto)
  author: User;

  @Expose()
  @Column("simple-array", { nullable: true })
  tags: string[];

  @Expose()
  @Column({ default: false })
  isPublished: boolean;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Expose()
  get isDraft(): boolean {
    return !this.isPublished;
  }
}
