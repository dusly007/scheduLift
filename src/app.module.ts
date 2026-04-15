import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { ReservationsModule } from './reservations/reservations.module';
import { Course } from './courses/course.entity';
import { Reservation } from './reservations/entity/reservation.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WaitList } from './wait-list/wait-list.entity';
import { WaitListModule } from './wait-list/wait-list.module';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/contact.entity';
@Module({
  imports: [TypeOrmModule.forRoot(
    {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Course, Reservation, WaitList, Contact],
  autoLoadEntities: true,
  synchronize: true
}
),
ContactModule,
UsersModule,
AuthModule,
CoursesModule,
ReservationsModule,
WaitListModule,
EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}