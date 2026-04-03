import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        //trouver le id de l'utilisateur current
        const request = context.switchToHttp().getRequest();
        return request.session.userId;
    }
}