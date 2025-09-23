import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Session } from "../../session/entities/session.entity";
import { GameLog } from "./game-log.entity";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  // Assuming Session is another entity, you may need to import it and set up the relation.
  // If Session is not an entity, adjust accordingly.
  // import { Session } from "./session.entity";
  @ManyToOne(() => Session, (session) => session.games)
  session: Session;

  @OneToMany(() => GameLog, (gameLog) => gameLog.game)
  gameLogs: GameLog[];
}
