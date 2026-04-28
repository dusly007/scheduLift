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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Course, Reservation, WaitList, Contact],
      autoLoadEntities: true,
      synchronize: true,
    }),

    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"Schedulift Support" <${config.get<string>('EMAIL_USER')}>`,
        },
      }),
    }),

    UsersModule,
    AuthModule,
    CoursesModule,
    ReservationsModule,
    WaitListModule,
    ContactModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}