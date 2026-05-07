import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Groupe } from 'src/groupe/groupe.entity';

@Entity()
export class Reservation{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId: number;

    @Column()
    groupeId: number;

    @ManyToOne(() => User)
    //plusieurs réservations --> 1 user
    user: User;

    @ManyToOne(() => Groupe)
    //plusieurs réservations --> 1 cours
    groupe: Groupe;

    @CreateDateColumn()
    createdAt: Date;


}
