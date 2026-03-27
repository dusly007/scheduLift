import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./service/users.service";
import { UsersController } from "./users.controller";
import { AuthService } from "src/auth/auth.service";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CurrentUserMiddleware } from "./middlewares/currentUser.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    //providers: [UsersService, AuthService, CurrentUserInterceptor],
    controllers: [UsersController],
    providers: [UsersService, AuthService, 
//        {
//            provide: APP_INTERCEPTOR,
//            useClass: CurrentUserInterceptor
//        }
    ],

    exports:[UsersService],
})  

export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserMiddleware)
            .forRoutes('*')//appliquer a toute les routes
    }
}