import { Module } from '@nestjs/common';
import { WaitListService } from './wait-list.service';
import { WaitListController } from './wait-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitList } from './wait-list.entity';
import { GroupeModule } from 'src/groupe/groupe.module'; // remplace CoursesModule
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([WaitList]),
      GroupeModule,       
      ReservationsModule,   
  ],
  providers: [WaitListService],
  controllers: [WaitListController]
})
export class WaitListModule {}
