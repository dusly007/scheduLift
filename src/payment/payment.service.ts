// src/payment/payment.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  async createPayment(dto: CreatePaymentDto) {

    if (dto.cardNumber.length < 8) {
      throw new BadRequestException('Numéro de carte invalide');
    }

    if (dto.cvv.length !== 3) {
      throw new BadRequestException('CVV invalide');
    }

    if (!dto.expiration) {
      throw new BadRequestException('Date d\'expiration invalide');
    }

    if (!dto.amount || dto.amount <= 0) {
      throw new BadRequestException('Montant invalide');
    }

    // ici paiement fake
    return {
      success: true,
      message: `Paiement de ${dto.amount}€ effectué avec succès`,
      courseId: dto.courseId,
      groupeId: dto.groupeId,
      userId: dto.userId,
    };
  }
}