import { PermissionEnum } from "@/common/permission.enum";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID
} from "class-validator";

import { ApiPropertyOptional } from "@nestjs/swagger";

export class AttachPermissionDto {
  @ApiPropertyOptional({
    type: [String],
    description: "Array of permission IDs to attach to the role.",
    example: ["64b7c2f1e4b0a1a2b3c4d5e6", "64b7c2f1e4b0a1a2b3c4d5e7"],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID("4", { each: true })
  permissionIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(PermissionEnum, { each: true })
  permissionNames?: PermissionEnum[];
}
