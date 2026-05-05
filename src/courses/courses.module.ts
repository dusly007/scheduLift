import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
//client http
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CoursesSeeder } from './courses.seeder';
import { GroupeSeeder } from '../groupe/groupe.seeder'; 
import { Groupe } from '../groupe/groupe.entity'; // entité Groupe pour le seede
import { ServiceModule } from '../service/service.module'; 
import { Service } from '../service/service.entity'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Groupe, Service]), // ajouter Groupe et Service pour le seeder
    HttpModule,
    ServiceModule,  
  ],
  providers: [CoursesService, CoursesSeeder, GroupeSeeder],
  controllers: [CoursesController],
  exports: [CoursesService]
})
export class CoursesModule {}