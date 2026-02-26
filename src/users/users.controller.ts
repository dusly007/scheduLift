import { Body, Controller, Get, Param, Patch, Post, Session } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user-dto";
import { UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { SerializeInterceptor } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor"; 
import { AuthService } from "./service/auth.service";

@Controller('auth')
export class UsersController {
   
        constructor(private usersService: UsersService ,private  authService: AuthService) {}
 
        @Post('/signup')
        async create(@Body() body : CreateUserDto, @Session() session: any) {
            //console.log(body);
            //return this.usersService.create(body.email, body.password);
            const user = await this.authService.signup(body.email, body.password);
            session.userId = user.id
            return user;
        }

      
        @Post('/signin')
        async signin(@Body() body : CreateUserDto , @Session() session: any) {
            //console.log(body);
            //return this.usersService.create(body.email, body.password);
            const user = await this.authService.signin(body.email, body.password);
            session.userId = user.id
            return user;
        }

        @Post('/signout')
        async signout(@Body() body : CreateUserDto , @Session() session: any) {
            //console.log(body);
            //return this.usersService.create(body.email, body.password);
            //const user = await this.authService.signin(body.email, body.password);
            session.userId = null
            //return user;
        }


        @Get('/whoami')
        whoAmI(@Session() session : any) {
            const user = this.usersService.findOne(session.userId);
            return user;
 
           
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