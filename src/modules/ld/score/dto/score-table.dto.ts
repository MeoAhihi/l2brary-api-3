import { User } from "@/modules/iam/user/entities/user.entity";
import { Expose, Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

import { ScoreColumn } from "../entities/score-column.entity";
import { Score } from "../entities/score.entity";

export class ScoreTableDto {
  @ApiProperty({ type: () => UserInfo })
  @Type(() => UserInfo)
  @Expose()
  user: User;

  @ApiProperty({ type: () => [ScoreInfo] })
  @Type(() => ScoreInfo)
  @Expose()
  scores: Score[];

  @ApiProperty({ type: Number })
  @Expose()
  average: number;
}

export class UserInfo {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  fullName: string;

  @ApiProperty({ type: String })
  @Expose()
  internationalName: string;
}

export class ScoreInfo {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: Number })
  @Expose()
  score: number;

  @ApiProperty({ type: () => ScoreColumnInfo })
  @Type(() => ScoreColumnInfo)
  @Expose()
  scoreColumn: ScoreColumn;
}

export class ScoreColumnInfo {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Number })
  @Expose()
  coefficient: number;
}
