import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    signin(){

        //1. check if email is in the database

        //2. hash the password

        //3. create new user

        //4. return user

        return 'this action will sign in a user';
    }

    signup(){
        return 'this action will sign up a user';
    }
}
