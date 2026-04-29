import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
//client http
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CoursesSeeder } from './courses.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    HttpModule 
  ],
  providers: [CoursesService, CoursesSeeder],
  controllers: [CoursesController],
  exports: [CoursesService]
})
export class CoursesModule {}