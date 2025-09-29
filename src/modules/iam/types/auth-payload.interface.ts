import { PermissionEnum } from "src/common/permission.enum";

export interface AuthPayload {
  sub: string;
  roles: string[];
  permissions: string[];
}
