import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRole } from "../user.entity";

@Injectable()
export class CoachGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (!request.currentUser) {
            return false;
        }

        //coach OU admin 
        return request.currentUser.role === UserRole.COACH 
            || request.currentUser.role === UserRole.ADMIN;
    }
}