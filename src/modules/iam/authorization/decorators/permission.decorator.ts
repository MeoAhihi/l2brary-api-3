import { SetMetadata } from "@nestjs/common";
import { PermissionEnum } from "src/common/permission.enum";

export const PERMISSION_KEY = "PERMISSION_KEY";

export const RequirePermission = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
