import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity()
export class Groupe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    // relation vers Course
    @Column()
    courseId: number;

    @ManyToOne(() => Course)
    course: Course;

    @Column({ type: 'datetime' })
    dateDebut: Date;

    @Column({ type: 'datetime' })
    dateFin: Date;

    // durée en semaines
    @Column()
    dureeEnSemaines: number;

    // ex: Lundi/Mercredi 9h-10h
    @Column({ nullable: true })
    horaire: string;

    // tranche d'âge
    @Column({ default: 0 })
    ageMin: number;

    @Column({ default: 99 })
    ageMax: number;

    // homme, femme, mixte
    @Column({ default: 'mixte' })
    genre: string;

    @Column()
    capaciteMax: number;

    @Column({ nullable: true })
    coachName: string;

    // validé par admin
    @Column({ default: false })
    estValide: boolean;

    @CreateDateColumn()
    createdAt: Date;
}