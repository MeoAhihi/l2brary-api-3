import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("int")
  point: number;

  @Column()
  category: string;
}
