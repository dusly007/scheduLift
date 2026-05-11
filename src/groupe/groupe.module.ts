import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groupe } from './groupe.entity';
import { GroupeService } from './groupe.service';
import { GroupeController } from './groupe.controller';
import { GroupeSeeder } from './groupe.seeder';
import { Course } from '../courses/course.entity';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Groupe, Course]),
        forwardRef(() => ReservationsModule), //forwardRef pour éviter la dépendance circulaire
    ],
    providers: [GroupeService, GroupeSeeder],
    controllers: [GroupeController],
    exports: [GroupeService]
})
export class GroupeModule {}