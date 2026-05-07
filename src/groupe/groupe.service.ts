import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groupe } from './groupe.entity';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class GroupeService {
    constructor(
        @InjectRepository(Groupe) private repo: Repository<Groupe>,
    ) {}

    async createGroupe(attrs: CreateGroupeDto, user: User) {
        // capacité > 0
        if (attrs.capaciteMax <= 0) {
            throw new BadRequestException('La capacité doit être supérieure à 0');
        }

        // vérifier tranche d'âge 
        if (attrs.ageMin && attrs.ageMax && attrs.ageMin > attrs.ageMax) {
            throw new BadRequestException('L\'âge minimum doit être inférieur à l\'âge maximum');
        }

        //genre valide
        if (attrs.genre && !['homme', 'femme', 'mixte'].includes(attrs.genre)) {
            throw new BadRequestException('Genre invalide — valeurs acceptées : homme, femme, mixte');
        }

        // vérifier dateFin après dateDebut
        if (attrs.dateDebut && attrs.dateFin && new Date(attrs.dateFin) <= new Date(attrs.dateDebut)) {
            throw new BadRequestException('La date de fin doit être après la date de début');
        }

        // patron stratégie selon le rôle
        let estValide: boolean;
        if (user.role === UserRole.ADMIN) {
            estValide = true;  
        } else if (user.role === UserRole.COACH) {
            estValide = false; 
            // validation coach — seulement ses propres cours
            if (attrs.coachName && attrs.coachName !== user.email) {
                throw new ForbiddenException('Vous ne pouvez créer des groupes que pour vos propres cours');
            }
            // forcer le coachName à l'email du coach connecté
            attrs.coachName = user.email;
        } else {
            throw new ForbiddenException('Accès refusé');
        }

        const groupe = this.repo.create({ ...attrs, estValide });
        return await this.repo.save(groupe);
    }

    // tous les groupes
    findAllGroupes() {
        return this.repo.find({ relations: ['course'] });
    }

    // groupes d'un cours
    findGroupesByCourse(courseId: number) {
        return this.repo.find({
            where: { courseId },
            relations: ['course']
        });
    }

    // un groupe par id
    async findGroupeById(id: number) {
        const groupe = await this.repo.findOne({
            where: { id },
            relations: ['course']
        });
        if (!groupe) {
            throw new NotFoundException('Groupe non trouvé');
        }
        return groupe;
    }

    // modifier un groupe — coach et admin
    async updateGroupe(id: number, attrs: Partial<CreateGroupeDto>, user: User) {
        const groupe = await this.repo.findOneBy({ id });
        if (!groupe) {
            throw new NotFoundException('Groupe non trouvé');
        }

        // validation coach — seulement ses propres groupes
        if (user.role === UserRole.COACH && groupe.coachName !== user.email) {
            throw new ForbiddenException('Vous ne pouvez modifier que vos propres groupes');
        }

        // vérifier capacité si modifiée
        if (attrs.capaciteMax !== undefined && attrs.capaciteMax <= 0) {
            throw new BadRequestException('La capacité doit être supérieure à 0');
        }

        // vérifier tranche d'âge si modifiée
        if (attrs.ageMin !== undefined && attrs.ageMax !== undefined && attrs.ageMin > attrs.ageMax) {
            throw new BadRequestException('L\'âge minimum doit être inférieur à l\'âge maximum');
        }

        // vérifier dateFin après dateDebut si modifiées
        if (attrs.dateDebut && attrs.dateFin && new Date(attrs.dateFin) <= new Date(attrs.dateDebut)) {
            throw new BadRequestException('La date de fin doit être après la date de début');
        }

        Object.assign(groupe, attrs);
        return await this.repo.save(groupe);
    }

    // supprimer un groupe — coach et admin
    async deleteGroupe(id: number, user: User) {
        const groupe = await this.repo.findOneBy({ id });
        if (!groupe) {
            throw new NotFoundException('Groupe non trouvé');
        }

        // validation coach — seulement ses propres groupes
        if (user.role === UserRole.COACH && groupe.coachName !== user.email) {
            throw new ForbiddenException('Vous ne pouvez supprimer que vos propres groupes');
        }

        await this.repo.remove(groupe);
        return { message: 'Groupe supprimé avec succès' };
    }

    // activer ou désactiver un groupe — admin seulement
    async toggleValide(id: number) {
        const groupe = await this.repo.findOneBy({ id });
        if (!groupe) {
            throw new NotFoundException('Groupe non trouvé');
        }
        groupe.estValide = !groupe.estValide;
        return await this.repo.save(groupe);
    }
}