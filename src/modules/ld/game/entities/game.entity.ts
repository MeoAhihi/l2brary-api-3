import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Session } from "../../session/entities/session.entity";
import { GameLog } from "./game-log.entity";

@Entity()
export class Game {
  @PrimaryGeneratedColumn("increment")
  id: number;

  // Assuming Session is another entity, you may need to import it and set up the relation.
  // If Session is not an entity, adjust accordingly.
  // import { Session } from "./session.entity";
  @ManyToOne(() => Session, (session) => session.games)
  session: Session;

  @OneToMany(() => GameLog, (gameLog) => gameLog.game)
  gameLogs: GameLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
