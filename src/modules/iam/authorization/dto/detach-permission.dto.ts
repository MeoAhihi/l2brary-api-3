import { ArrayNotEmpty, IsArray, IsString, IsUUID } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class DetachPermissionDto {
  @ApiProperty({
    description: "Array of permission IDs to detach from the role",
    type: [String],
    example: ["perm-uuid-1", "perm-uuid-2"],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("4", { each: true })
  permissionIds: string[];
}
