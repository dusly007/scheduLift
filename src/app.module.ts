import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { ContactModule } from './contact/contact.module';
import { WaitListModule } from './wait-list/wait-list.module';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User],
  synchronize: true,
  autoLoadEntities: true
}
), 
UsersModule, ContactModule, WaitListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
