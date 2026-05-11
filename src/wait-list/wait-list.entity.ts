import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn , UpdateDateColumn} from 'typeorm';
import { User } from '../users/user.entity';
import { Groupe } from '../groupe/groupe.entity';

@Entity()
export class WaitList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    groupeId: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Groupe)
    groupe: Groupe;

    @CreateDateColumn()
    createdAt: Date; 

    // indique qu'une place est libérée — le client doit payer pour confirmer
    @Column({ default: false })
    pretAPayer: boolean;

    @UpdateDateColumn()
    updatedAt: Date;

}
