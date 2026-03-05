import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"

@Injectable()
export class AuthGuards implements CanActivate{

    canActivate(context: ExecutionContext) {

        // si l'utilisateur est connecté, on retourne true. si non on retourne false.
        const request = context.switchToHttp().getRequest();
        return request.session.userId;
        

    }

}