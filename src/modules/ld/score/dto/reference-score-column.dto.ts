import { Expose } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

export class ReferenceScoreColumnDto {
  @ApiProperty({ type: Number, description: "Score column ID" })
  @Expose()
  id: number;

  @ApiProperty({ type: String, description: "Score column name" })
  @Expose()
  name: string;
}
