import { PermissionEnum } from "src/common/permission.enum";

import { SetMetadata } from "@nestjs/common";

export const PERMISSION_KEY = "PERMISSION_KEY";

export const RequirePermission = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
