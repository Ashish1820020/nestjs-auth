import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from 'src/auth/decorators/public.decorator';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflactor: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    console.log('Role Guard');

    const isPublicRoute = this.reflactor.getAllAndOverride<boolean>(
      PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute) return true;

    const requiredRoles = this.reflactor.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const currentUser = context.switchToHttp().getRequest().user;
    const hasRequiredRoles = requiredRoles.some(
      (role: Role) => role === currentUser.role,
    );
    console.log(requiredRoles, currentUser);
    return hasRequiredRoles;
  }
}
