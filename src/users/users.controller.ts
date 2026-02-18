import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";

@Controller('users')
export class UsersController {
    
        constructor(private usersService: UsersService) {}

        @Post()
        create(@Body() body : CreateUserDto) {
            console.log(body);
        }
}