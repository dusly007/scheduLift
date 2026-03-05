import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"

@Injectable()
export class AdminGuards implements CanActivate{

    canActivate(context: ExecutionContext) {

        // si l'admin est connecté, on retourne true. si non on retourne false.
        const request = context.switchToHttp().getRequest();
        const user = request.currentUser;
        //console.log('if user ', user, 'and if admin ',  user.admin);
       
        return user.admin;
        //return request.session.currentUser.admin;

    }

}