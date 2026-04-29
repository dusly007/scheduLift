import {Entity, PrimaryGeneratedColumn, Column, AfterInsert} from 'typeorm'; 
import { Exclude } from 'class-transformer';

export enum UserRole {
  CLIENT = 'client',
  COACH = 'coach',
  ADMIN = 'admin',
}

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ type: 'varchar', default: UserRole.CLIENT })
    role: UserRole;

    @AfterInsert()
    logInsert(){
        console.log(`Inserted user with id: ${this.id}`);
    }

    //@Column({default : true})
    //admin: boolean;
}