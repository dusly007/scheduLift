import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import {randomBytes, scrypt as _script} from 'crypto';
import {promisify} from 'util';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {

    constructor(private usersService : UsersService){}

   async signup(email:string, password: string){

        //1. check if email is in use
        const users = await this.usersService.findUserByEmail(email);
        if (users.length){
            throw new BadRequestException('email in use')
        }
        

        //2. hash the password
        //2.1 generate salt
        const salt = randomBytes(8).toString('hex'); // 16 charactères de salt
        //2.2 hash the salt and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // 2.3 join the hashed result and salt together in bd
        const result = salt + '.' + hash.toString('hex');

        //3. create new user
       const user = await this.usersService.create(email, result)

        //4. return user

        return user;
    }

    async signin(email : string, password : string){

        // 1. find user by email
        const [user] = await this.usersService.findUserByEmail(email);

        // 1. 2. if user not found, throw error
        if (!user){
            throw new NotFoundException('user not found');
        }

        // 2. retrieve the salt and hash from stored password

        const [salt, storedHash] = user.password.split('.');

        //3 hast supplied password with salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //4 compare the hashed result with the stored hash, if they match, return usrer
        if (hash.toString('hex') !== storedHash){
            throw new BadRequestException('bas password');
        }
        
        return user;
    }
    /*whoAmI(userId: number){
        
        if(!userId){
            return ("Personne n'est connectée");
        }
        else{
            return this.usersService.findOne(userId);
        }
        
    }*/
}
