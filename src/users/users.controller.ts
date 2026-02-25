import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { SerializeInterceptor } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
// import { UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { Serialize } from "../interceptors/serialize.interceptor";


@Controller('auth')
export class UsersController {
   
    constructor(private service: UsersService) {}
       
 
        @Post()
        create(@Body() body : CreateUserDto) {
            //console.log(body);
            return this.service.create(body.email, body.password);
        }
 
        @Patch('/:id')
        updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
             return this.service.updateUser(parseInt(id), body);
        }
       // @UseInterceptors(ClassSerializerInterceptor)
       // @UseInterceptors(new SerializeInterceptor(UserDto))
        @Serialize(UserDto)
        @Get('/:id')
        findUser(@Param('id') id: string) {
            console.log('Handler is running');
            return this.service.findOne(parseInt(id));
        }
 
        @Get()
        findAllUsers() {
            return this.service.findAllUsers();
        }
}