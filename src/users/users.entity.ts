import { AfterInsert, Entity, PrimaryGeneratedColumn, Column} from 'typeorm'; 
import { Exclude } from 'class-transformer';
@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log(`Inserted user with id: ${this.id}`);
    }
}