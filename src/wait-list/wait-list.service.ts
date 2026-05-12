import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaitList } from './wait-list.entity';
import { GroupeService } from '../groupe/groupe.service';
import { ReservationsService } from '../reservations/reservations.service';
import { OnEvent } from '@nestjs/event-emitter';

// délai d'expiration en heures — si le client ne paie pas dans ce délai la place passe au suivant
const EXPIRATION_HEURES = 24;
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

        // vérifier groupe complet
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
        
        const MIN_WAITLIST_FOR_GROUP = 1;
        
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
        // récupérer toute la liste FIFO — exclure ceux qui sont pretAPayer
        const waitlist = await this.repo.find({
            where: { groupeId, pretAPayer: false },
            order: { createdAt: 'ASC' }
        });

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

        const { groupeId, pretAPayer } = waitlist;
        await this.repo.remove(waitlist);

        //  si le client se retire alors qu'une place lui était réservée
        // passer la place au suivant dans la liste
        if (pretAPayer) {
            await this.moveNext({ groupeId });
        }

        return { message: 'Retiré de la liste d\'attente avec succès' };
    }

    // vérifier et expirer les pretAPayer trop anciens
    // à appeler manuellement ou via un cron job
    async expireOldPretAPayer() {
        const maintenant = new Date();
        const limitExpiration = new Date(
            maintenant.getTime() - EXPIRATION_HEURES * 60 * 60 * 1000
        );

        // trouver les entrées pretAPayer dont pretAPayerDepuis > délai
        const expired = await this.repo.find({
            where: { pretAPayer: true }
        });

        for (const entry of expired) {
            // vérifier si l'entrée a expiré — utiliser updatedAt si disponible, sinon createdAt
            const dateReference = (entry as any).updatedAt || entry.createdAt;
            if (new Date(dateReference) < limitExpiration) {
                const { groupeId } = entry;
                // retirer l'entrée expirée
                await this.repo.remove(entry);
                // passer la place au suivant
                await this.moveNext({ groupeId });
            }
        }
    }

    // patron observateur — quand une réservation est annulée
    @OnEvent('cancel.reservation')
    async moveNext(payload: { groupeId: number }) {
        // ✅ vérifier d'abord si quelqu'un a un pretAPayer expiré pour ce groupe
        // et le retirer avant de notifier le suivant
        const maintenant = new Date();
        const limitExpiration = new Date(
            maintenant.getTime() - EXPIRATION_HEURES * 60 * 60 * 1000
        );

        const pretAPayerExistant = await this.repo.findOne({
            where: { groupeId: payload.groupeId, pretAPayer: true },
            order: { createdAt: 'ASC' }
        });

        // si quelqu'un a déjà une place en attente de paiement et pas encore expiré
        // ne pas notifier le suivant — attendre que ce client paie ou que ça expire
        if (pretAPayerExistant) {
            const dateReference = (pretAPayerExistant as any).updatedAt || pretAPayerExistant.createdAt;
            if (new Date(dateReference) > limitExpiration) {
                // pas encore expiré — ne rien faire
                return;
            }
            // expiré — retirer et continuer vers le suivant
            await this.repo.remove(pretAPayerExistant);
        }

        // trouver le premier de la liste (FIFO) — exclure ceux pretAPayer
        const next = await this.repo.findOne({
            where: { groupeId: payload.groupeId, pretAPayer: false },
            order: { createdAt: 'ASC' }
        });

        // ne rien faire si personne
        if (!next) return;

        // marquer comme prêt à payer — ne pas créer la réservation directement
        await this.repo.update(next.id, { pretAPayer: true });
    }
}