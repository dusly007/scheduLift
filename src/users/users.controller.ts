import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user-dto";
import { UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { SerializeInterceptor } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor"; 
@Controller('auth')
export class UsersController {
   
        constructor(private usersService: UsersService) {}
 
        @Post()
        create(@Body() body : CreateUserDto) {
            //console.log(body);
            return this.usersService.create(body.email, body.password);
        }
 
        @Patch('/:id')
        updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
             return this.usersService.updateUser(parseInt(id), body);
        }
        //@UseInterceptors(ClassSerializerInterceptor)
        //@UseInterceptors(new SerializeInterceptor(UserDto))
        @Serialize(UserDto)
        @Get('/:id')
        findUser(@Param('id') id: string) {
            return this.usersService.findOne(parseInt(id));
        }
        @Get()
        findAllUsers() {
            return this.usersService.findAllUsers();
        }
}