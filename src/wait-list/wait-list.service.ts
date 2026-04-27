import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaitList } from './wait-list.entity';
import { CoursesService } from '../courses/courses.service';
import { ReservationsService } from '../reservations/reservations.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class WaitListService {
    constructor(
        @InjectRepository(WaitList) private repo: Repository<WaitList>,
        private coursesService: CoursesService,
        private reservationsService: ReservationsService,
    ) {}

    async addToWaitlist(userId: number, courseId: number) {
        const course = await this.coursesService.findCourseById(courseId);

        // Vérifier cours complet
        const reservations = await this.reservationsService.findAllReservationsByCourse(courseId);
        if (reservations.length < course.capacity) {
            throw new BadRequestException('Ce cours n\'est pas complet, vous pouvez réserver directement');
        }

    // vérifier que l'utilisateur n'a pas déjà une réservation
        const dejaReserve = await this.reservationsService.findOneReservation(userId, courseId);
            if (dejaReserve) {
            throw new BadRequestException('Vous avez déjà une réservation pour ce cours');
        }


        const dejaEnAttente = await this.repo.findOne({ where: { userId, courseId } });
        if (dejaEnAttente) {
            throw new BadRequestException('Vous êtes déjà sur la liste d\'attente');
        }

        const waitlist = this.repo.create({ userId, courseId });
        return await this.repo.save(waitlist);
    }


    findWaitlistByCourse(courseId: number) {
        //FIFO 
        return this.repo.find({
            where: { courseId },
            //ASC = plus petit au plus grand
            order: { createdAt: 'ASC' }
        });
    }

    findWaitlistByUser(userId: number) {
        return this.repo.find({ where: { userId } });
    }

    async removeFromWaitlist(id: number) {
        const waitlist = await this.repo.findOneBy({ id });

        if (!waitlist) {
            throw new NotFoundException('Entrée non trouvée dans la liste d\'attente');
        }

        await this.repo.remove(waitlist);
        return { message: 'Retiré de la liste d\'attente avec succès' };
    }

    //A FAIRE
    //patron observateur
    //quand on cancel
    @OnEvent('cancel.reservation')
    async moveNext(payload: {courseId : number}) {
        //trouver le premier de la liste(FIFO)
        const next = await this.repo.findOne({
            where: { courseId: payload.courseId },
            order: { createdAt: 'ASC' }
        });
        //ne rien faire si personne  
        if(!next) return;

        // Créer une réservation pour le premier en attente
        await this.reservationsService.createReservation(next.userId, payload.courseId);
        
        // Retirer de la liste d'attente
        await this.repo.remove(next);
       

    }

       
}
