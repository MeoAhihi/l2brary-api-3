import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("reset_password_codes")
export class ResetPasswordCode {
  @PrimaryColumn({ type: "varchar", length: 6 })
  code: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column()
  expireTime: Date;
}
