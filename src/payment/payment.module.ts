import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
    imports: [ReservationsModule], // pour accéder à ReservationsService
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}