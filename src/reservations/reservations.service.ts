import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entity/reservation.entity';
import { CoursesService } from '../courses/courses.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReservationsService {
        constructor(
        @InjectRepository(Reservation) private repo: Repository<Reservation>,
        private coursesService: CoursesService,
        private eventEmitter: EventEmitter2,
    ) {}

    //A FAIRE: logique qui met à jour les places restantes, vérifier que le cours existe, vérifier que le cours est actif
    async createReservation(userId: number, courseId:number){
        //vérifier cours existe
        const course = await this.coursesService.findCourseById(courseId);

        //vérifier cours actif
        if (!course.isActive){
            throw new BadRequestException('Ce cours n\'est pas disponible');
        }

        // compter les réservations existantes
        //.count() plus performant que .find().length au lieu de récupérer tous mes enregistrements
        const currentReservationsCount = await this.repo.count({ 
            where: { courseId } 
        });

        // calculer places restantes 
        const placesRestantes = course.capacity - currentReservationsCount;

        if (placesRestantes <= 0) {
            throw new BadRequestException(
                'Ce cours est complet, vous pouvez vous inscrire sur la liste d\'attente'
            );
        }

        /*
        //vérifier capacité
        const reservations = await this.repo.find({where:{courseId}});
        if (reservations.length >= course.capacity){
            throw new BadRequestException('Ce cours est complet, vous pouvez vous inscrire sur la liste d\'attente');
        }*/

        const dejaReserve = await this.repo.findOne({ where: { userId, courseId } });
            if (dejaReserve) {
                throw new BadRequestException('Vous avez déjà réservé ce cours');
    }


        const reservation = this.repo.create({userId, courseId})
        return await this.repo.save(reservation)
    }

    findAllReservations(){
        return this.repo.find();
    }

    findReservationsByUser(userId: number){
        return this.repo.find({
             where: { userId },
             relations: ['course'] // détails du cours 
            });
    }

    findAllReservationsByCourse(courseId: number) {
        return this.repo.find({ where: { courseId } });
    }

    //A FAIRE
    async cancelReservation(id: number, userId: number){
        const reservation = await this.repo.findOneBy({id});

        if(!reservation){
            throw new NotFoundException('Réservation non trouvé')
        }

        if (reservation.userId !== userId) {
            throw new BadRequestException("Vous ne pouvez pas annuler la réservation d'un autre utilisateur");
        }

        const {courseId} = reservation;
        await this.repo.remove(reservation);

        this.eventEmitter.emit(
            'cancel.reservation',({courseId})
        )

        return {message: 'Réservation annulé avec succès'}
    }

    async getPlacesRestantes(courseId: number) {
        const course = await this.coursesService.findCourseById(courseId);
        const count = await this.repo.count({ where: { courseId } });
        return {
            courseId,
            capacity: course.capacity,
            reserved: count,
            placesRestantes: course.capacity - count
        };
    }

    findOneReservation(userId: number, courseId: number) {
        return this.repo.findOne({ where: { userId, courseId } });
    }

}