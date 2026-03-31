import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateCourseDto } from './dtos/create-course.dto'; 

@Injectable()
export class CoursesService {
    constructor (
        @InjectRepository(Course) private repo: Repository <Course>,
        private readonly httpService: HttpService,
    ){}

    //methode async
    async createCourse(attrs: CreateCourseDto) {
        const course = this.repo.create(attrs);
    }

    findAllCourses() {
    return this.repo.find();
    }

    //methode async
    async findCourseById(id: number) {
        const course = await this.repo.findOneBy({ id });
    
        if (!course) {
          throw new NotFoundException('course not found');
        }
    
        return course;
      }
    
    //methode async
    async updateCourse(id: number, attrs: Partial<CreateCourseDto>) {
        const course = await this.repo.findOneBy({ id });
    
        if (!course) {
          throw new NotFoundException('course not found');
        }
    
        Object.assign(course, attrs);
        return await this.repo.save(course);
      }
    

    //methode async
    async deleteCourse(id: number) {
        const course = await this.repo.findOneBy({ id });
    
        if (!course) {
          throw new NotFoundException('course not found');
        }
    
        await this.repo.remove(course);
    
        return {
          message: 'course deleted successfully',
        };
      }
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



