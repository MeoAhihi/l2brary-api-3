import { UserModule } from "@/modules/iam/user/user.module";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionModule } from "../session/session.module";
import { GameLog } from "./entities/game-log.entity";
import { Game } from "./entities/game.entity";
import { PlusScoreLog } from "./entities/plus-score-log.entity";
import { GameLogService } from "./game-log.service";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { PlusScoreLogService } from "./plus-score-log.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, GameLog, PlusScoreLog]),
    SessionModule,
    UserModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameLogService, PlusScoreLogService],
})
export class GameModule {}
