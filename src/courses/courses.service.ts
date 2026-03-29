import { Injectable } from '@nestjs/common';
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
    async importAPi() {
    const options = {
        method: 'GET',
        url: 'https://exercisedb.p.rapidapi.com/exercises',
        params: { limit: '5' }, //plus claire
        headers: {

            'X-RapidAPI-Key': '493558b012msh9bb9493828a9fb2p134977jsn3541546919f8',
            //nom de API
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        } 
    };

    //extraire mes donnée
    const { data } = await firstValueFrom(this.httpService.request(options));

    //boucler a travers chaque exo 
    for (const exo of data) {
    //mapping pour créer objet(exo)
        const course = this.repo.create({
            title: exo.name,
            description: `Entraînement ciblé : ${exo.target}. Zone : ${exo.bodyPart}.`,
            capacity: 15,
            gifUrl: exo.gifUrl,
            isActive: true
        });
    await this.repo.save(course);
    }
    //petit return de validation
    return { message: "5 cours importés avec succès !" };
  }
}



