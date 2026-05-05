import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaitList } from './wait-list.entity';
import { GroupeService } from '../groupe/groupe.service'; // remplace CoursesService
import { ReservationsService } from '../reservations/reservations.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class WaitListService {
    constructor(
        @InjectRepository(WaitList) private repo: Repository<WaitList>,
        private groupeService: GroupeService, // remplace coursesService
        private reservationsService: ReservationsService,
    ) {}

    async addToWaitlist(userId: number, groupeId: number) {
        // vérifier que le groupe existe
        const groupe = await this.groupeService.findGroupeById(groupeId);

        // Vérifier cours complet
        const reservations = await this.reservationsService.findAllReservationsByGroupe(groupeId);
        if (reservations.length < groupe.capaciteMax) {
            throw new BadRequestException('Ce groupe n\'est pas complet, vous pouvez réserver directement');
        }

        // vérifier que l'utilisateur n'a pas déjà une réservation
        const dejaReserve = await this.reservationsService.findOneReservation(userId, groupeId);
        if (dejaReserve) {
            throw new BadRequestException('Vous avez déjà une réservation pour ce groupe');
        }

        const dejaEnAttente = await this.repo.findOne({ where: { userId, groupeId } });
        if (dejaEnAttente) {
            throw new BadRequestException('Vous êtes déjà sur la liste d\'attente');
        }

        const waitlist = this.repo.create({ userId, groupeId });
        return await this.repo.save(waitlist);
    }

    findWaitlistByGroupe(groupeId: number) {
        //FIFO 
        return this.repo.find({
            where: { groupeId },
            //ASC = plus petit au plus grand
            order: { createdAt: 'ASC' }
        });
    }

    findWaitlistByUser(userId: number) {
        return this.repo.find({ where: { userId } });
    }

    async removeFromWaitlist(id: number) {
        const waitlist = await this.repo.findOneBy({ id });

        if (!waitlist) {
            throw new NotFoundException('Entrée non trouvée dans la liste d\'attente');
        }

        await this.repo.remove(waitlist);
        return { message: 'Retiré de la liste d\'attente avec succès' };
    }

    //A FAIRE
    //patron observateur
    //quand on cancel
    @OnEvent('cancel.reservation')
    async moveNext(payload: { groupeId: number }) {
        //trouver le premier de la liste(FIFO)
        const next = await this.repo.findOne({
            where: { groupeId: payload.groupeId },
            order: { createdAt: 'ASC' }
        });
        //ne rien faire si personne  
        if (!next) return;

        // Créer une réservation pour le premier en attente
        await this.reservationsService.createReservation(next.userId, payload.groupeId);

        // Retirer de la liste d'attente
        await this.repo.remove(next);
    }
}