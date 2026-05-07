import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groupe } from './groupe.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class GroupeSeeder implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Groupe) private repo: Repository<Groupe>,
        @InjectRepository(Course) private courseRepo: Repository<Course>,
    ) {}

    // automatiquement au démarrage de l'app
    async onApplicationBootstrap() {
        // géré par CoursesSeeder — ne rien faire ici
    }

    async seedGroupes() {
        // tous les cours existants
        const courses = await this.courseRepo.find();

        // si pas de cours fait rien
        if (courses.length === 0) return;

        // données groupes pour chaque cours
        const groupesParCours = [
            {
                titre: 'Musculation — Poitrine',
                groupes: [
                    {
                        nom: 'Groupe A — Débutants',
                        dateDebut: new Date('2026-05-05'),
                        dateFin: new Date('2026-05-26'),
                        dureeEnSemaines: 3,
                        horaire: 'Lundi/Mercredi 9h-10h',
                        ageMin: 18,
                        ageMax: 40,
                        genre: 'mixte',
                        capaciteMax: 10,
                        coachName: 'coach.poitrine@schedulift.com',
                    },
                    {
                        nom: 'Groupe B — Intermédiaires',
                        dateDebut: new Date('2026-05-06'),
                        dateFin: new Date('2026-05-27'),
                        dureeEnSemaines: 3,
                        horaire: 'Mardi/Jeudi 18h-19h',
                        ageMin: 18,
                        ageMax: 99,
                        genre: 'homme',
                        capaciteMax: 8,
                        coachName: 'coach.poitrine@schedulift.com',
                    },
                ],
            },
            {
                titre: 'Cardio Intensif',
                groupes: [
                    {
                        nom: 'Groupe A — Tous niveaux',
                        dateDebut: new Date('2026-05-05'),
                        dateFin: new Date('2026-06-02'),
                        dureeEnSemaines: 4,
                        horaire: 'Lundi/Mercredi/Vendredi 7h-8h',
                        ageMin: 16,
                        ageMax: 60,
                        genre: 'mixte',
                        capaciteMax: 15,
                        coachName: 'coach.cardio@schedulift.com',
                    },
                ],
            },
            {
                titre: 'Yoga & Étirements',
                groupes: [
                    {
                        nom: 'Groupe A — Débutants',
                        dateDebut: new Date('2026-05-07'),
                        dateFin: new Date('2026-06-18'),
                        dureeEnSemaines: 6,
                        horaire: 'Mercredi/Vendredi 10h-11h',
                        ageMin: 18,
                        ageMax: 99,
                        genre: 'femme',
                        capaciteMax: 10,
                        coachName: 'coach.yoga@schedulift.com',
                    },
                    {
                        nom: 'Groupe B — Avancés',
                        dateDebut: new Date('2026-05-07'),
                        dateFin: new Date('2026-06-18'),
                        dureeEnSemaines: 6,
                        horaire: 'Mardi/Jeudi 17h-18h',
                        ageMin: 25,
                        ageMax: 99,
                        genre: 'mixte',
                        capaciteMax: 8,
                        coachName: 'coach.yoga@schedulift.com',
                    },
                ],
            },
            {
                titre: 'Musculation — Dos',
                groupes: [
                    {
                        nom: 'Groupe A — Tous niveaux',
                        dateDebut: new Date('2026-05-06'),
                        dateFin: new Date('2026-06-03'),
                        dureeEnSemaines: 4,
                        horaire: 'Mardi/Jeudi 19h-20h',
                        ageMin: 18,
                        ageMax: 55,
                        genre: 'mixte',
                        capaciteMax: 12,
                        coachName: 'coach.dos@schedulift.com',
                    },
                ],
            },
            {
                titre: 'Pilates',
                groupes: [
                    {
                        nom: 'Groupe A — Débutants',
                        dateDebut: new Date('2026-05-08'),
                        dateFin: new Date('2026-05-29'),
                        dureeEnSemaines: 3,
                        horaire: 'Vendredi 11h-12h',
                        ageMin: 18,
                        ageMax: 70,
                        genre: 'mixte',
                        capaciteMax: 8,
                        coachName: 'coach.pilates@schedulift.com',
                    },
                ],
            },
        ];

        for (const coursData of groupesParCours) {
            // trouver cours par titre
            const course = courses.find(c => c.title === coursData.titre);
            if (!course) continue;

            for (const groupeData of coursData.groupes) {
                const groupe = this.repo.create({
                    ...groupeData,
                    courseId: course.id,
                    estValide: true, // validé par défaut dans seeder
                });
                await this.repo.save(groupe);
            }
        }

        console.log('Groupes créés avec succès !');
    }
}