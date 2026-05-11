import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ReservationsService } from '../reservations/reservations.service';
import { User } from '../users/user.entity';

@Injectable()
export class PaymentService {
    constructor(
        private reservationsService: ReservationsService,
    ) {}

    async createPayment(dto: CreatePaymentDto, user: User) {
        // validation numéro de carte
        if (dto.cardNumber.length < 8) {
            throw new BadRequestException('Numéro de carte invalide');
        }

        // validation CVV
        if (dto.cvv.length !== 3) {
            throw new BadRequestException('CVV invalide');
        }

        // validation date expiration
        if (!dto.expiration) {
            throw new BadRequestException('Date d\'expiration invalide');
        }

        // validation montant
        if (!dto.amount || dto.amount <= 0) {
            throw new BadRequestException('Montant invalide');
        }

        // paiement fake réussi — créer la réservation automatiquement
        // passer user pour validation âge/genre
        const reservation = await this.reservationsService.createReservation(
            user.id,
            dto.groupeId,
            user
        );

        return {
            success: true,
            message: `Paiement de ${dto.amount}$ effectué avec succès`,
            groupeId: dto.groupeId,
            reservationId: reservation.id,
        };
    }
}