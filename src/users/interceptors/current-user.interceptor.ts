import { NestInterceptor, UseInterceptors, ExecutionContext, CallHandler, Injectable} from "@nestjs/common";
import { Observable } from "rxjs";
import { CurrentUser } from "../decorators/current-user.decorator";
import { UsersService } from "../service/users.service";
import {NotFoundException } from '@nestjs/common';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{

    constructor(private usersService : UsersService){}
   
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        //trouver l'id de l'utilisateur courant à partir du userId stocké dans la session,
        const request = context.switchToHttp().getRequest();
        const userId = request.session.userId ||{};

        // trouver l'utilisateur dans la base de donnée en utilisant le userId
       /* if(!userId){
            
            throw new NotFoundException('user not found');
        }
            request.currentUser = user;
*/
            if(userId){
            
                const user = this.usersService.findOne(userId);
                request.currentUser = user;
            }
            
     
       
        // assigner l'utilisateur trouvé à une nouvelle propriété sur la requette

        
        //go pour request handler ou next interceptor
        return next.handle()
    
    }
}


 
    
    