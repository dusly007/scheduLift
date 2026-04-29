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
            // chaque cours associé à son coach et mot-clé de recherche Pexels
            const coursesACreer = [
                { bodyPart: 'chest',      title: 'Musculation — Poitrine', description: 'Cours ciblé sur les pectoraux.',           capacity: 15, coachName: 'coach.poitrine@schedulift.com', searchQuery: 'chest press weightlifting' },
                { bodyPart: 'cardio',     title: 'Cardio Intensif',        description: 'Séance cardio pour brûler des calories.',  capacity: 20, coachName: 'coach.cardio@schedulift.com',   searchQuery: 'cardio running treadmill'  },
                { bodyPart: 'waist',      title: 'Yoga & Étirements',      description: 'Yoga axé sur le tronc et la flexibilité.', capacity: 12, coachName: 'coach.yoga@schedulift.com',     searchQuery: 'yoga mat stretching'       },
                { bodyPart: 'back',       title: 'Musculation — Dos',      description: 'Renforcement du dos et des lombaires.',     capacity: 15, coachName: 'coach.dos@schedulift.com',      searchQuery: 'back pull workout barbell' },
                { bodyPart: 'lower legs', title: 'Pilates',                description: 'Pilates centré sur les jambes.',           capacity: 10, coachName: 'coach.pilates@schedulift.com',  searchQuery: 'pilates exercise mat'      },
            ];

            for (const coursInfo of coursesACreer) {
                // chercher une image cohérente sur Pexels
                const { data: imgData } = await firstValueFrom(
                    this.httpService.get(`https://api.pexels.com/v1/search?query=${coursInfo.searchQuery}&per_page=1`, {
                        headers: { Authorization: 'c3ZcXxckAOgKdqGq5f6XIPMabVxtQHMvMDeOApAKP6DXigBQCpw2ezid' }
                    })
                );

                // prendre la première image trouvée
                const gifUrl = imgData.photos[0]?.src?.medium || null;

                const course = this.repo.create({
                    title: coursInfo.title,
                    description: coursInfo.description,
                    capacity: coursInfo.capacity,
                    gifUrl, // image de Pexels
                    bodyPart: coursInfo.bodyPart,
                    coachName: coursInfo.coachName, // associer le coach au cours
                    isActive: true,
                });

                await this.repo.save(course);
            }

            console.log('5 cours créés avec succès !');
    }
}