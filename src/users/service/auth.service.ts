import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UsersService } from './users.service';
import { error } from 'console';
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    
    signin(email : string){
        //1.
        if (!email){
            throw new error('email not valid')
        }
        //2. hash the pswd
        //3.create new user
        //4.return user
        return 'this action will sign a user';
    }

    signup(){
        
        return'this action will sign up a user'
    }
}
