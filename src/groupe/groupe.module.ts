import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groupe } from './groupe.entity';
import { GroupeService } from './groupe.service';
import { GroupeController } from './groupe.controller';
import { GroupeSeeder } from './groupe.seeder'; 
import { Course } from '../courses/course.entity'; 
@Module({
    imports: [TypeOrmModule.forFeature([Groupe, Course])],
    providers: [GroupeService, GroupeSeeder],
    controllers: [GroupeController],
    exports: [GroupeService] // pour Reservation et WaitList
})
export class GroupeModule {}