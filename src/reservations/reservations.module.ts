import { Module, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { GroupeModule } from 'src/groupe/groupe.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reservation]),
        forwardRef(() => GroupeModule), // forwardRef pour éviter la dépendance circulaire
    ],
    providers: [ReservationsService],
    controllers: [ReservationsController],
    exports: [ReservationsService]
})
export class ReservationsModule {}