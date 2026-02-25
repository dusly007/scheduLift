import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { UsersService } from "./service/users.service";
import { UsersController } from "./users.controller";
import { AuthService } from './service/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, AuthService],
    controllers: [UsersController]
})  
export class UsersModule {}