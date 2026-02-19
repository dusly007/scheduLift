import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user-dto";

@Controller('users')
export class UsersController {
    
        constructor(private usersService: UsersService) {}

        @Post('/signup')
        create(@Body() body : CreateUserDto) {
            //console.log(body);
            return this.usersService.create(body.email, body.password );
        }

        @Patch('/id')
        updateUser(@Param('id') id : string, @Body() body:UpdateUserDto){
            return this.usersService.updateUser(parseInt(id), body)
        }
}