import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entity/reservation.entity';
import { GroupeService } from '../groupe/groupe.service'; // remplace CoursesService
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation) private repo: Repository<Reservation>,
        private groupeService: GroupeService, // remplace coursesService
        private eventEmitter: EventEmitter2,
    ) {}

    async createReservation(userId: number, groupeId: number, user?: User) {
        // vérifier que le groupe existe
        const groupe = await this.groupeService.findGroupeById(groupeId);

        // vérifier que le groupe est validé
        if (!groupe.estValide) {
            throw new BadRequestException('Ce groupe n\'est pas disponible');
        }

        // vérifier âge et genre du client si user fourni
        if (user) {
            // vérifier le genre
            if (groupe.genre !== 'mixte' && user.sexe !== groupe.genre) {
                throw new BadRequestException(
                    `Ce groupe est réservé aux ${groupe.genre}s`
                );
            }

            // vérifier l'âge si dateNaissance présente
            if (user.dateNaissance) {
                const age = new Date().getFullYear() - new Date(user.dateNaissance).getFullYear();
                if (age < groupe.ageMin || age > groupe.ageMax) {
                    throw new BadRequestException(
                        `Ce groupe est réservé aux ${groupe.ageMin} — ${groupe.ageMax} ans`
                    );
                }
            }
        }

        // compter les réservations existantes
        // .count() plus performant que .find().length au lieu de récupérer tous mes enregistrements
        const currentReservationsCount = await this.repo.count({
            where: { groupeId }
        });

        // calculer places restantes
        const placesRestantes = groupe.capaciteMax - currentReservationsCount;

        if (placesRestantes <= 0) {
            throw new BadRequestException(
                'Ce groupe est complet, vous pouvez vous inscrire sur la liste d\'attente'
            );
        }

        const dejaReserve = await this.repo.findOne({ where: { userId, groupeId } });
        if (dejaReserve) {
            throw new BadRequestException('Vous avez déjà réservé ce groupe');
        }

        const reservation = this.repo.create({ userId, groupeId });
        return await this.repo.save(reservation);
    }

    findAllReservations() {
        return this.repo.find({ relations: ['groupe'] });
    }

    findReservationsByUser(userId: number) {
        return this.repo.find({
            where: { userId },
            relations: ['groupe', 'groupe.course'] // détails du groupe
        });
    }

    findAllReservationsByGroupe(groupeId: number) {
        return this.repo.find({ where: { groupeId } });
    }

    findOneReservation(userId: number, groupeId: number) {
        return this.repo.findOne({ where: { userId, groupeId } });
    }

    async cancelReservation(id: number, userId: number, user?: User) {
        const reservation = await this.repo.findOneBy({ id });

        if (!reservation) {
            throw new NotFoundException('Réservation non trouvé');
        }

        // admin peut annuler n'importe quelle réservation
        // client peut annuler seulement la sienne
        if (user?.role !== UserRole.ADMIN && reservation.userId !== userId) {
            throw new BadRequestException("Vous ne pouvez pas annuler la réservation d'un autre utilisateur");
        }

        const { groupeId } = reservation;
        await this.repo.remove(reservation);

        // patron observateur — notifier la waitlist qu'une place s'est libérée
        this.eventEmitter.emit('cancel.reservation', { groupeId });

        return { message: 'Réservation annulé avec succès' };
    }

    async getPlacesRestantes(groupeId: number) {
        const groupe = await this.groupeService.findGroupeById(groupeId);
        const count = await this.repo.count({ where: { groupeId } });
        return {
            groupeId,
            capaciteMax: groupe.capaciteMax,
            reserved: count,
            placesRestantes: groupe.capaciteMax - count
        };
    }
}
