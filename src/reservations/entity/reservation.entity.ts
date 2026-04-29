import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Course } from 'src/courses/course.entity';

@Entity()
export class Reservation{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId: number;

    @Column()
    courseId: number

    @ManyToOne(() => User)
    //plusieurs réservations --> 1 user
    user: User;

    @ManyToOne(() => Course)
    //plusieurs réservations --> 1 cours
    course: Course;

    @CreateDateColumn()
    createdAt: Date;


}