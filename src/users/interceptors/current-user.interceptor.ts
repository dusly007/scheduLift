import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, Session } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../service/users.service"; 
import { error } from "console";
import { ExternalExceptionFilter } from "@nestjs/core/exceptions/external-exception-filter";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{

    constructor(private usersService: UsersService) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        //trouver le id de l'utilisateur current
        const request = context.switchToHttp().getRequest();

        const userId = request.session.userId || {}
        
        //gestion d'erreur bloque l'app( pas de user au début(signin) donc bloque)
        if(!userId){    
            //throw new ('aucun Id utilisateur trouver')
            //console.log('aucun Id utilisateur trouver') 
        }
        // trouver l'utilisateur current
        const user = this.usersService.findOne(userId)

        //assigner l'utilisateur trouvé à une nouvelle propriété sur la requete
        request.currentUser = user;

       return next.handle();
    }
}