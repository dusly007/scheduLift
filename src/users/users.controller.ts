import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { UpdateUserDto } from "./dtos/update-user-dto"; 
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from "src/auth/guards/auth.guards";
import { AdminGuard } from "src/users/guards/admin.guards";
import { CurrentUserMiddleware } from "./middlewares/currentUser.middleware";
import { CoachGuard } from "./guards/coach.guard";
 


@Controller('users')
export class UsersController {
   
        constructor(private usersService: UsersService ,private  authService: AuthService) {}
        @UseGuards(AuthGuard)
        @Patch('/:id')
        updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
             return this.usersService.updateUser(parseInt(id), body);
        }

        
        @UseGuards(AdminGuard)
        @Get('/:id')
        findUser(@Param('id') id: string) {
            return this.usersService.findOne(parseInt(id));
        }
        
        @UseGuards(AdminGuard)
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