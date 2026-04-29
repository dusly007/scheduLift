import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRole } from "../user.entity"; 
@Injectable()
export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        //Verifie role au lieu de booleen admin
        if (!request.currentUser){
            return false
        }
        return request.currentUser.role === UserRole.ADMIN;
    }

}