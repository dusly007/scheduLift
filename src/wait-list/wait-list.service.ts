import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaitList } from './wait-list.entity';
import { GroupeService } from '../groupe/groupe.service';
import { ReservationsService } from '../reservations/reservations.service';
import { OnEvent } from '@nestjs/event-emitter';
import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service';

@Injectable()
export class WaitListService {
    constructor(
        @InjectRepository(WaitList) private repo: Repository<WaitList>,
        private groupeService: GroupeService,
        private reservationsService: ReservationsService,
        private adminNotificationsService: AdminNotificationsService,
    ) {}

    async addToWaitlist(userId: number, groupeId: number) {
        const groupe = await this.groupeService.findGroupeById(groupeId);
    
        const reservations = await this.reservationsService.findAllReservationsByGroupe(groupeId);
        if (reservations.length < groupe.capaciteMax) {
            throw new BadRequestException('Ce groupe n\'est pas complet, vous pouvez réserver directement');
        }
    
        const dejaReserve = await this.reservationsService.findOneReservation(userId, groupeId);
        if (dejaReserve) {
            throw new BadRequestException('Vous avez déjà une réservation pour ce groupe');
        }
    
        const dejaEnAttente = await this.repo.findOne({ where: { userId, groupeId } });
        if (dejaEnAttente) {
            throw new BadRequestException('Vous êtes déjà sur la liste d\'attente');
        }
    
        const waitlist = this.repo.create({ userId, groupeId });
        const savedWaitlist = await this.repo.save(waitlist);
    
        const waitlistCount = await this.repo.count({
            where: { groupeId },
        });
        
        const MIN_WAITLIST_FOR_GROUP = 10;
        
        if (waitlistCount >= MIN_WAITLIST_FOR_GROUP) {
            await this.adminNotificationsService.createWaitlistGroupReadyNotification({
                groupeId,
                groupeName: `Groupe #${groupe.id}`,
                courseTitle: groupe.course?.title || 'Cours non précisé',
                waitlistCount,
            });
        }
    
        return savedWaitlist;
    }

    findWaitlistByGroupe(groupeId: number) {
        // FIFO
        return this.repo.find({
            where: { groupeId },
            order: { createdAt: 'ASC' }
        });
    }

    // waitlist d'un utilisateur avec infos du groupe
    findWaitlistByUser(userId: number) {
        return this.repo.find({
            where: { userId },
            relations: ['groupe', 'groupe.course'],
            order: { createdAt: 'ASC' }
        });
    }

    // position de l'utilisateur dans la liste d'attente d'un groupe
    async getPosition(userId: number, groupeId: number) {
        // récupérer toute la liste FIFO
        const waitlist = await this.repo.find({
            where: { groupeId },
            order: { createdAt: 'ASC' }
        });

        // trouver la position — index + 1 pour commencer à 1
        const position = waitlist.findIndex(w => w.userId === userId) + 1;

        if (position === 0) {
            throw new NotFoundException('Vous n\'êtes pas sur la liste d\'attente de ce groupe');
        }

        return {
            position,
            total: waitlist.length,
            message: `Vous êtes ${position}${position === 1 ? 'er' : 'ème'} sur ${waitlist.length} en attente`,
        };
    }

    async removeFromWaitlist(id: number) {
        const waitlist = await this.repo.findOneBy({ id });

        if (!waitlist) {
            throw new NotFoundException('Entrée non trouvée dans la liste d\'attente');
        }

        await this.repo.remove(waitlist);
        return { message: 'Retiré de la liste d\'attente avec succès' };
    }

    // patron observateur — quand une réservation est annulée
    @OnEvent('cancel.reservation')
    async moveNext(payload: { groupeId: number }) {
        // trouver le premier de la liste (FIFO)
        const next = await this.repo.findOne({
            where: { groupeId: payload.groupeId },
            order: { createdAt: 'ASC' }
        });

        // ne rien faire si personne
        if (!next) return;

        // créer une réservation pour le premier en attente
        await this.reservationsService.createReservation(next.userId, payload.groupeId);

        // retirer de la liste d'attente
        await this.repo.remove(next);
    }
}