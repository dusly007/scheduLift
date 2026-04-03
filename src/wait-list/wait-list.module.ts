import { Module } from '@nestjs/common';
import { WaitListService } from './wait-list.service';
import { WaitListController } from './wait-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitList } from './wait-list.entity';
import { CoursesModule } from 'src/courses/courses.module';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([WaitList]),
      CoursesModule,       
      ReservationsModule,   
  ],
  providers: [WaitListService],
  controllers: [WaitListController]
})
export class WaitListModule {}
