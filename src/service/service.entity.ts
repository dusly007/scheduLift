import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    @OneToMany(() => Course, course => course.service)
    courses: Course[];
}