
import {Injectable, NestMiddleware } from '@nestjs/common'
import { UsersService } from "../service/users.service";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
    constructor(private userService: UsersService){}

    async use(req: any, rest: any, next: () => void){
        const userId = req.session.userId || {};
        if (userId){
            const user = await this.userService.findOne(userId);
            req.currentUser = user;
        }
        next();
    }
}