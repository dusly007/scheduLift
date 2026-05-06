import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Service } from '../service/service.entity';

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
  
  @Column({ nullable: true })
  gifUrl: string; //URL

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ nullable: true })
  coachName: string; //pour savoir quel coach gere le cours

  // niveau du cours
  @Column({ nullable: true })
  niveau: string;

  // relation vers Service
  @Column({ nullable: true })
  serviceId: number;

  @ManyToOne(() => Service, service => service.courses, { nullable: true })
  service: Service;
}