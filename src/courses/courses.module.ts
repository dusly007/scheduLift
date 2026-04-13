import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
//client http
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),//à faire: créer entité
    HttpModule // faire appels API
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService]// pour plus tard ex:reservation
})
export class CoursesModule {}