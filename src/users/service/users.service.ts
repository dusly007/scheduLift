import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
 
@Injectable()
export class UsersService {
 
    constructor(@InjectRepository(User) private repo : Repository<User>) {}
 
    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
        // return this.repo.save(this.repo.create({ email, password }));
    }
 
    findOne(id: number) {
        return this.repo.findOneBy({ id });
    }

    findAllUsers() {
        return this.repo.find(); // Récupère tous les utilisateurs
    }
    async updateUser(id: number, attrs: Partial<User>) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
            //lancer erreur not found
            throw new Error('User not found');
        }
 
        Object.assign(user, attrs);
        return this.repo.save(user);
    }
    
    async findAllUsersByEmail(email:string){
        return await this.repo.findBy({email});
    }
 
}