import { createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";


export const CurrentUser = createParamDecorator(
    (data : never, context : ExecutionContextHost) =>{
        const request = context.switchToHttp().getRequest();

        return request.currentUser;
    } 
)