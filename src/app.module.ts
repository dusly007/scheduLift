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
import { Contact } from './contact/contact.entity';
import { ContactModule } from './contact/contact.module';
import { ServiceModule } from './service/service.module';
import { Service } from './service/service.entity';
import { GroupeModule } from './groupe/groupe.module';
import { Groupe } from './groupe/groupe.entity';
import { PaymentModule } from './payment/payment.module';
import { AdminNotificationsModule } from './admin-notifications/admin-notifications.module';

@Module({
  imports: [
    // Chargement global des variables d'environnement (.env ou environnement Kubernetes)
    ConfigModule.forRoot({ isGlobal: true }), 

    // Configuration dynamique pour basculer de SQLite à MySQL (Schedulift DB)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', '10.10.3.11'),
        port: config.get<number>('DB_PORT', 3306),
        
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASSWORD', 'root'),
        database: config.get<string>('DB_NAME', 'schedulift'),
        entities: [User, Course, Reservation, WaitList, Contact, Service, Groupe], 
        autoLoadEntities: true,
        synchronize: true, // Génère automatiquement tes tables Schedulift dans MySQL au démarrage
      }),
    }),

    // Configuration du module de courriels
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

    // Modules applicatifs de Schedulift
    UsersModule,
    AuthModule,
    CoursesModule,
    ReservationsModule,
    WaitListModule,
    ContactModule, 
    EventEmitterModule.forRoot(), 
    ServiceModule, 
    GroupeModule, 
    PaymentModule, 
    AdminNotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}