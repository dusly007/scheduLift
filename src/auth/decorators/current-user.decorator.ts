import { createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { CurrentUserInterceptor } from "../../users/interceptors/current-user.interceptor";

export const CurrentUser = createParamDecorator(
    (data : never, context : ExecutionContextHost) =>{
        const request = context.switchToHttp().getRequest();

        return request.currentUser;
    } 
)