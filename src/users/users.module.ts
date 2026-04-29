import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./service/users.service";
import { UsersController } from "./users.controller";
import { AuthService } from "src/auth/auth.service";
import { CurrentUserMiddleware } from "./middlewares/currentUser.middleware";
import { UsersSeeder } from "./users.seeder";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, AuthService, UsersSeeder

    ],

    exports:[UsersService],
})  

export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserMiddleware)
            .forRoutes('*')//appliquer a toute les routes
    }
}