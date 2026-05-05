import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { GroupeModule } from 'src/groupe/groupe.module'; 

@Module({
  imports : [
    TypeOrmModule.forFeature([Reservation]),
    GroupeModule 

  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService]
})
export class ReservationsModule {}