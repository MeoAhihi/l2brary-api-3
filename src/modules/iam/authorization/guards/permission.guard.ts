// auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../decorators/permission.decorator";
import { PermissionEnum } from "src/common/permission.enum";
import { AuthPayload } from "../../authentication/interfaces/auth-payload.interface";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // no role restriction
    }

    const { user }: { user: AuthPayload } = context.switchToHttp().getRequest();

    if (
      !user ||
      !user.permissions ||
      !requiredPermissions.every((permission) =>
        user.permissions.includes(permission)
      )
    ) {
      throw new ForbiddenException("You do not have access to this resource");
    }

    return true;
  }
}
