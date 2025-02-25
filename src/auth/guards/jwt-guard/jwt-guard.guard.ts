import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/auth/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor (private reflactor: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log("JwtAuthGuard");

        const isPublicRoute = this.reflactor.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        
        if (isPublicRoute) return true;
        return super.canActivate(context);
    }
}
