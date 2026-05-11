import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AdminNotificationType {
  WAITLIST_GROUP_READY = 'waitlist_group_ready',
}

@Entity()
export class AdminNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  notificationType: AdminNotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'integer', nullable: true })
  groupeId: number | null;

  @Column({ type: 'varchar', nullable: true })
  groupeName: string | null;

  @Column({ type: 'varchar', nullable: true })
  courseTitle: string | null;

  @Column({ type: 'integer', nullable: true })
  courseId: number | null;

  @Column({ type: 'integer', nullable: true })
  serviceId: number | null;

  @Column({ type: 'integer', default: 0 })
  waitlistCount: number;

  @CreateDateColumn()
  createdAt: Date;
}