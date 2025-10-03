import { ReferenceUserDto } from "@/modules/iam/user/dto/reference-user.dto";
import { User } from "@/modules/iam/user/entities/user.entity";
import { Expose, Type } from "class-transformer";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { ApiProperty } from "@nestjs/swagger";

import { Session } from "./session.entity";

@Entity("attendance")
export class Attendance {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Expose()
  @ManyToOne(() => User)
  @JoinColumn()
  @Type(() => ReferenceUserDto)
  user: User;

  @Expose()
  @ApiProperty({
    description: "Attend time",
    type: Date,
  })
  @Column({
    name: "attend_time",
  })
  attendTime: Date;

  @ManyToOne(() => Session, (session) => session.attendances)
  session: Session;
}
