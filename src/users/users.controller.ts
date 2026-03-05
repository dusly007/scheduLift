import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { SerializeInterceptor } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
// import { UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { Serialize } from "../interceptors/serialize.interceptor";
import {AuthService} from './service/auth.service';
import { CurrentUser } from "./decorators/current-user.decorator";
import {User} from "./users.entity"
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { AuthGuards } from "../guards/auth.guard"; 
import { Admin } from "typeorm";
import { AdminGuards } from "src/guards/admin.guard";

//@UseInterceptors(CurrentUserInterceptor)
@Controller('auth')

//@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
   
    constructor(private service: UsersService,
                private authService : AuthService) {}
       
 
        @Post('/signup')
        async createUser(@Body() body : CreateUserDto, @Session() session : any) {
            //console.log(body);
            //return this.service.create(body.email, body.password);
            //return this.authService.signup(body.email, body.password);
            const user = await this.authService.signup(body.email, body.password);
            session.userId = user.id;
            return user;
        }


        @Post('/signin')
        async signin(@Body() body : CreateUserDto, @Session() session : any) {
            //console.log(body);
            //return this.service.create(body.email, body.password);
            //return this.authService.signin(body.email, body.password);
            const user = await this.authService.signin(body.email, body.password);
            session.userId = user.id;
            return user;
        }

        @UseGuards(AuthGuards) // auth guard 
        @Get('/whoAmI')
        async whoAmI(@CurrentUser() user: User){
           //const user = this.authService.whoAmI(session.userId);
           //return user;
            return user;
           
        }

        @Post('/signout')
        signOut(@Session() session : any){
            session.userId = null ;
            
            }
        
        @UseGuards(AuthGuards) // auth guard  
        @Patch('/:id')
        updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
             return this.service.updateUser(parseInt(id), body);
        }
       // @UseInterceptors(ClassSerializerInterceptor)
       // @UseInterceptors(new SerializeInterceptor(UserDto))
        @Serialize(UserDto)
        @UseGuards(AuthGuards) // auth guard 
        @Get('/:id')
        findUser(@Param('id') id: string) {
            console.log('Handler is running');
            return this.service.findOne(parseInt(id));
        }
 
        @UseGuards(AdminGuards)
        @Get()
        findAllUsers() {
            return this.service.findAllUsers();
        }
        
        @UseGuards(AdminGuards)
        @Delete('/:id')
        removeUser(@Param('id') id: string){
            return this.service.removeUser(parseInt(id));
        }
}