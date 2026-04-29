import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity()
export class WaitList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    courseId: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Course)
    course: Course;

    @CreateDateColumn()
    createdAt: Date; 

}
