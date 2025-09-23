import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("invite_codes")
export class InviteCode {
  @PrimaryColumn({ type: "varchar", length: 6 })
  code: string;

  @Column("text", { nullable: true })
  email?: string;

  @Column({ type: "timestamp" })
  expireTime: Date;
}
