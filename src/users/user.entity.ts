import { Entity, PrimaryGeneratedColumn, Column, AfterInsert } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  CLIENT = 'client',
  COACH = 'coach',
  ADMIN = 'admin',
}

export enum UserSexe {
  HOMME = 'homme',
  FEMME = 'femme',
  AUTRE = 'autre',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  prenom: string;

  @Column({ default: '' })
  nom: string;

  @Column({ default: '' })
  dateNaissance: string;

  @Column({ type: 'varchar', default: UserSexe.AUTRE })
  sexe: UserSexe;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'varchar', default: UserRole.CLIENT })
  role: UserRole;

  @AfterInsert()
  logInsert() {
    console.log(`Inserted user with id: ${this.id}`);
  }
}