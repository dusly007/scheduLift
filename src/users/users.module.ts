import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { UsersService } from "./service/users.service";
import { UsersController } from "./users.controller";
import { AuthService } from './service/auth.service';
import { CurrentUser } from "./decorators/current-user.decorator";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import {APP_INTERCEPTOR} from '@nestjs/core'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    // providers: [UsersService, AuthService, CurrentUserInterceptor],
    controllers: [UsersController],
    providers: [UsersService, AuthService, {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor
    }]
  })
  export class UsersModule {}

  //ajouter le guard pour bloquer la route