import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user-dto";
import { UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { SerializeInterceptor } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor"; 
import { AuthService } from "./service/auth.service";
import { CurrentUser } from "./decorateur/current-user.decorator";
import { User } from "./user.entity";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { AuthGuard } from "src/guards/auth.guards";
import { AdminGuard } from "src/guards/admin.guards";
import { CurrentUserMiddleware } from "./middlewares/currentUser.middleware";

@UseInterceptors(CurrentUserInterceptor)

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
        whoAmI(@CurrentUser() user : User){
            console.log(user)
            return user
        }

        //@Get('/whoami')
        //whoAmI(@Session() session : any, @CurrentUser() user : any) {
        //    console.log('ici ', this.authService.whoami(session.userId));
        //    return this.authService.whoami(session.userId);     
        //}
 

 
        @Patch('/:id')
        updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
             return this.usersService.updateUser(parseInt(id), body);
        }

        //@UseInterceptors(ClassSerializerInterceptor)
        //@UseInterceptors(new SerializeInterceptor(UserDto))
        @UseGuards(AdminGuard)
        @Serialize(UserDto)
        @Get('/:id')
        findUser(@Param('id') id: string) {
            return this.usersService.findOne(parseInt(id));
        }
        
        @UseGuards(AuthGuard)
        @Get()
        findAllUsers() {
            return this.usersService.findAllUsers();
        }

        @UseGuards(AdminGuard)
        @Delete('/:id')
        removeUser(@Param('id') id: string){
            return this.usersService.removeUser(parseInt(id))
        }

}