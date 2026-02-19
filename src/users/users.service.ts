import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo : Repository<User>) {}
    create (email : string, password: string){
        const user = this.repo.create({email, password})
        return this.repo.save(user);

        //return this.repo.save({email,password})
    }

    findAllUsers(){}
    findOne(id : number){}

    async updateUser(id:number, attrs: Partial<User>){
        const user = await this.repo.findOneBy({id:1});
    

        if(!user){
            //lancer erreur not found
            return null
        }

        Object.assign(user,attrs);
        return this.repo.save(user);
    }
}