import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoursesSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Course) private repo: Repository<Course>,
    private readonly httpService: HttpService,
  ) {}

  //automatiquement au démarrage de l'app
    async onApplicationBootstrap() {
        const count = await this.repo.count();

        //si cours existe on fait rien
        if (count > 0) return;

        await this.seedCourses();
    }

    async seedCourses() {
            const options = {
                method: 'GET',
                url: 'https://exercisedb.p.rapidapi.com/exercises',
                params: { limit: '50' },
                headers: {
                    'X-RapidAPI-Key': '493558b012msh9bb9493828a9fb2p134977jsn3541546919f8',
                    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                }
            };

            const { data } = await firstValueFrom(this.httpService.request(options));
            
            const coursesACreer = [
                { bodyPart: 'chest',      title: 'Musculation — Poitrine', description: 'Cours ciblé sur les pectoraux.',           capacity: 15 },
                { bodyPart: 'cardio',     title: 'Cardio Intensif',        description: 'Séance cardio pour brûler des calories.',  capacity: 20 },
                { bodyPart: 'waist',      title: 'Yoga & Étirements',      description: 'Yoga axé sur le tronc et la flexibilité.', capacity: 12 },
                { bodyPart: 'back',       title: 'Musculation — Dos',      description: 'Renforcement du dos et des lombaires.',     capacity: 15 },
                { bodyPart: 'lower legs', title: 'Pilates',                description: 'Pilates centré sur les jambes.',           capacity: 10 },
            ];

            for (const coursInfo of coursesACreer) {
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

            console.log('5 cours créés avec succès !');
    }
}

