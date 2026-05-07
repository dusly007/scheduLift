import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GroupeSeeder } from '../groupe/groupe.seeder'; // lancer seeder groupes après cours
import { ServiceSeeder } from '../service/service.seeder'; // lancer seeder services avant cours
import { Service } from '../service/service.entity'; // pour trouver les services

@Injectable()
export class CoursesSeeder implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Course) private repo: Repository<Course>,
        @InjectRepository(Service) private serviceRepo: Repository<Service>, 
        private readonly httpService: HttpService,
        private readonly groupeSeeder: GroupeSeeder, 
        private readonly serviceSeeder: ServiceSeeder,
    ) {}

    //automatiquement au démarrage de l'app
    async onApplicationBootstrap() {
        const count = await this.repo.count();

        //si cours existe on fait rien
        if (count > 0) return;

        // créer les services en premier
        await this.serviceSeeder.seedServices();

        await this.seedCourses();

        // lancer le seeder des groupes après les cours
        await this.groupeSeeder.seedGroupes();
    }

    async seedCourses() {
        // récupérer les services créés
        const services = await this.serviceRepo.find();
        const musculation = services.find(s => s.nom === 'Musculation');
        const cardio = services.find(s => s.nom === 'Cardio');
        const yoga = services.find(s => s.nom === 'Yoga & Bien-être');
        const collectifs = services.find(s => s.nom === 'Cours collectifs');

        // chaque cours associé à son coach, mot-clé Pexels et service — sans capacity
        const coursesACreer = [
            { bodyPart: 'chest',      title: 'Musculation — Poitrine', description: 'Cours ciblé sur les pectoraux.',           coachName: 'coach.poitrine@schedulift.com', searchQuery: 'chest press weightlifting', serviceId: musculation?.id },
            { bodyPart: 'cardio',     title: 'Cardio Intensif',        description: 'Séance cardio pour brûler des calories.',  coachName: 'coach.cardio@schedulift.com',   searchQuery: 'cardio running treadmill',  serviceId: cardio?.id      },
            { bodyPart: 'waist',      title: 'Yoga & Étirements',      description: 'Yoga axé sur le tronc et la flexibilité.', coachName: 'coach.yoga@schedulift.com',     searchQuery: 'yoga mat stretching',       serviceId: yoga?.id        },
            { bodyPart: 'back',       title: 'Musculation — Dos',      description: 'Renforcement du dos et des lombaires.',     coachName: 'coach.dos@schedulift.com',      searchQuery: 'back pull workout barbell', serviceId: musculation?.id },
            { bodyPart: 'lower legs', title: 'Pilates',                description: 'Pilates centré sur les jambes.',           coachName: 'coach.pilates@schedulift.com',  searchQuery: 'pilates exercise mat',      serviceId: collectifs?.id  },
        ];

        for (const coursInfo of coursesACreer) {
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
                gifUrl, // image de Pexels
                bodyPart: coursInfo.bodyPart,
                coachName: coursInfo.coachName, // associer le coach au cours
                serviceId: coursInfo.serviceId, // associer le service au cours
                isActive: true,
            });

            await this.repo.save(course);
        }

        console.log('5 cours créés avec succès !');
    }
}
