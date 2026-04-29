import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards } from "@nestjs/common";
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../users/user.entity'; // Pour typer @CurrentUser() user: User
import { AuthGuard } from './guards/auth.guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

        @Post('/signup')
        async create(@Body() body : CreateUserDto, @Session() session: any) {
            //console.log(body);
            //return this.usersService.create(body.email, body.password);
            const user = await this.authService.signup(body.email, body.password, body.role);
            session.userId = user.id
            return user;
        }

        @Post('/signin')
        async signin(@Body() body : CreateUserDto , @Session() session: any) {
            //console.log(body);
            const user = await this.authService.signin(body.email, body.password);
            //return this.usersService.create(body.email, body.password);                    const user = await this.authService.signin(body.email, body.password);
            session.userId = user.id
            return user;
        }
        
        @Post('/signout')
        async signout(@Session() session: any) {
            //console.log(body);
            //return this.usersService.create(body.email, body.password);
            //const user = await this.authService.signin(body.email, body.password);
            session.userId = null
            //return user;
        }
        
        @Get('/whoami')
        whoAmI(@CurrentUser() user : User){
            console.log(user)
            return user || null;
        }
        
    
    
}