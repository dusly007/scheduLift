import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User, UserRole } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
 
@Injectable()
export class UsersService {
 
    constructor(@InjectRepository(User) private repo : Repository<User>) {}
 
    create(email: string, password: string, role : UserRole) {
        const user = this.repo.create({ email, password, role: role || UserRole.CLIENT });
        return this.repo.save(user);
        // return this.repo.save(this.repo.create({ email, password }));
    }
 
    findOne(id: number) {
        if (!id) return null;
        return this.repo.findOneBy({ id });
    }

    findAllUsers() {
        return this.repo.find(); // Récupère tous les utilisateurs
    }
    async updateUser(id: number, attrs: Partial<User>) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
            //lancer erreur not found
            throw new NotFoundException('User not found');
        }
 
        Object.assign(user, attrs);
        return this.repo.save(user);
    }
    
    async findAllUsersByEmail(email:string){
        return await this.repo.findBy({email});
    }

    async removeUser(id : number){
        const user = await this.repo.findOneBy({id});
        if(!user){
            throw new NotFoundException('user not found')
        }

        return this.repo.remove(user)
    }

    async updateRole(id: number, role: UserRole) {
        
        if (!Object.values(UserRole).includes(role)) {
            throw new BadRequestException('Rôle invalide — valeurs acceptées : client, coach, admin');
        }
        const user = await this.repo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        user.role = role;
        return this.repo.save(user);
    }
 
}