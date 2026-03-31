import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, NestMiddleware, Session } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../service/users.service"; 
import { error } from "console";
import { ExternalExceptionFilter } from "@nestjs/core/exceptions/external-exception-filter";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor( private userService: UsersService) {}
 
    async use(req: any, res: any, next:() => void) {
        const { userId } = req.session;
        if (userId) {
            const user = await this.userService.findOne(userId);
            req.currentUser = user;
        }
        next()
    }
}