import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoursesService {
    constructor (
        @InjectRepository(Course) private repo: Repository <Course>,
        private readonly httpService: HttpService,
    ){}

    //methode async
    createCourse(){}

    findAllCourses() {
    return this.repo.find();
    }

    //methode async
    findCourseById(){}
    
    //methode async
    updateCourse(){}

    //methode async
    deleteCourse(){}

    //methode pour api
    //créer des exo et non cours pour l'instant il faudrait trouver un moyen dutiliser API pour créer des cours
    //seed: générer des données de départ automatiquement
    async importAPi() {
    const options = {
        method: 'GET',
        url: 'https://exercisedb.p.rapidapi.com/exercises',
        params: { limit: '50' }, //plus claire
        headers: {

            'X-RapidAPI-Key': '493558b012msh9bb9493828a9fb2p134977jsn3541546919f8',
            //nom de API
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        } 
    };

    //extraire mes donnée
    const { data } = await firstValueFrom(this.httpService.request(options));
    // créer 5 cours
    const coursesACreer = [
        { bodyPart: 'chest',       title: 'Musculation — Poitrine', description: 'Cours ciblé sur les pectoraux.',          capacity: 15 },
        { bodyPart: 'cardio',      title: 'Cardio Intensif',        description: 'Séance cardio pour brûler des calories.', capacity: 20 },
        { bodyPart: 'waist',       title: 'Yoga & Étirements',      description: 'Yoga axé sur le tronc et la flexibilité.',capacity: 12 },
        { bodyPart: 'back',        title: 'Musculation — Dos',      description: 'Renforcement du dos et des lombaires.',    capacity: 15 },
        { bodyPart: 'lower legs',  title: 'Pilates',                description: 'Pilates centré sur les jambes.',          capacity: 10 },
    ];
    //boucler 
    for (const coursInfo of coursesACreer) {
        // trouver un exo
        const exo = data.find((e: any) => e.bodyPart === coursInfo.bodyPart);

        const course = this.repo.create({
            title: coursInfo.title,
            description: coursInfo.description,
            capacity: coursInfo.capacity,
            gifUrl: exo ? exo.gifUrl : null,
            isActive: true,
        });

        await this.repo.save(course);
    }

    return { message: '5 cours importés avec succès !' };
    }

    //activer ou désactiver un cours
    async toggleActive(id: number) {
        const course = await this.repo.findOneBy({ id });

        if (!course) {
            throw new NotFoundException('Cours non trouvé');
        }

        course.isActive = !course.isActive;
        return this.repo.save(course);
    }

}



