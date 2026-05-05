import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';

@Injectable()
export class ServiceSeeder implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Service) private repo: Repository<Service>,
    ) {}

    // automatiquement au démarrage de l'app
    async onApplicationBootstrap() {
        // géré par CoursesSeeder — ne rien faire ici
    }

    async seedServices() {
        // si services existent on fait rien
        const count = await this.repo.count();
        if (count > 0) return;

        const services = [
            {
                nom: 'Musculation',
                description: 'Cours de renforcement musculaire pour tous les niveaux.',
                imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
            },
            {
                nom: 'Cardio',
                description: 'Cours d\'endurance et de condition physique.',
                imageUrl: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg',
            },
            {
                nom: 'Yoga & Bien-être',
                description: 'Cours axés sur la flexibilité et la relaxation.',
                imageUrl: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
            },
            {
                nom: 'Cours collectifs',
                description: 'Pilates et cours en groupe pour tous.',
                imageUrl: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg',
            },
        ];

        for (const serviceInfo of services) {
            const service = this.repo.create(serviceInfo);
            await this.repo.save(service);
        }

        console.log('4 services créés avec succès !');
    }
}