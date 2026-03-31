import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
 
@Module({
  imports: [TypeOrmModule.forRoot(
    {
  type: 'sqlite',
  database: 'db.sqlite',
  //entities: [User],
  autoLoadEntities: true,
  synchronize: true
}
),
UsersModule,
AuthModule,
CoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}