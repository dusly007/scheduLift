import { BadRequestException, Injectable, NotFoundException, Session } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/service/users.service';
import { error } from 'console';
import { randomBytes, scrypt as _scrypt} from 'crypto'; //pour generer notre salt
import { promisify } from 'util'; // pour transformer scrypt en une fonction quiretourne une promesse

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    
    async signup(email : string, password : string){
        //1. check if email is in use
        const users = await this.usersService.findAllUsersByEmail(email);
            if (users.length){
                throw new BadRequestException('email in use')
            }

        //2. hash the pswd
        //2.1generate salt
        const salt = randomBytes(8).toString('hex'); //16 char de salt

        //2.2hash salt and pswd together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        
        //2.3join hash result and salt together in bd
        const result = salt + '.' + hash.toString('hex')
        
        //3.create new user
        const user = await this.usersService.create(email, result)
        
        //4.return user
        return user
        //return 'this action will sign a user';
    }

    async signin(email : string, password : string){
        //find user by email
        const [user] = await this.usersService.findAllUsersByEmail(email);
        
        //1.2 if user not find throw error
        if (!user){
            throw new NotFoundException('user not found')
        }
        
        //2. retrieve the hashed paswd with salt
        const [salt, storedHash] = user.password.split('.');
        
        //3. hash the supplied pswd with the salt
        const hash =(await scrypt(password,salt, 32)) as Buffer;
        
        //4. compare the hashed result with the stored hash, if they match return user
        if (hash.toString('hex') !== storedHash){
            throw new BadRequestException('wrong password')
        }
        return user;
        //return'this action will sign up a user'
    }

    whoami(userId : number){
        if( !userId ){
            return "personne n'est connecté"
        }
        else{
           return this.usersService.findOne(userId);
        }
    }
}
