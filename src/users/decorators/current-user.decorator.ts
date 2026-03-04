import {createParamDecorator, ExecutionContext} from "@nestjs/common"

export const CurrentUser = createParamDecorator(
    (data: never, context : ExecutionContext) => {
        //return 'decorateur current user';
        const request = context.switchToHttp().getRequest();
        return request.currentUser;
    }
);
