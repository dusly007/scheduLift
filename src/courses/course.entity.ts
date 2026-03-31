import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  bodyPart: string; 

  @Column({ type: 'text', nullable: true })
  description: string;
  
  @Column({nullable: true})
  gifUrl: string; //URL

  @Column({ default: 10 })
  capacity: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ nullable: true })
  coachName: string; //pour savoir quel coach gere le cours
}