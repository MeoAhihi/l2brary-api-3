import { IsEnum } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { EnrollmentStatusEnum } from "../../types/enrollment-status.enum";

export class ManageEnrollmentDto {
  @ApiProperty({
    enum: EnrollmentStatusEnum,
    description: "The new status for the enrollment",
  })
  @IsEnum(EnrollmentStatusEnum)
  status: EnrollmentStatusEnum;
}
