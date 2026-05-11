import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  AdminNotification,
  AdminNotificationType,
} from './admin-notification.entity';

@Injectable()
export class AdminNotificationsService {
  constructor(
    @InjectRepository(AdminNotification)
    private repo: Repository<AdminNotification>,
  ) {}

  async createWaitlistGroupReadyNotification(attrs: {
    courseId?: number;
    serviceId?: number;
    waitlistCount: number;
  }) {
    if (!attrs.waitlistCount || attrs.waitlistCount < 1) {
      throw new BadRequestException('Nombre de personnes en attente invalide');
    }

    if (!attrs.courseId && !attrs.serviceId) {
      throw new BadRequestException('Un cours ou un service doit être lié à la notification');
    }

    const existingNotification = await this.repo.findOne({
      where: {
        notificationType: AdminNotificationType.WAITLIST_GROUP_READY,
        courseId: attrs.courseId ?? IsNull(),
        serviceId: attrs.serviceId ?? IsNull(),
        read: false,
      },
    });

    if (existingNotification) {
      existingNotification.waitlistCount = attrs.waitlistCount;
      existingNotification.message = `Il y a maintenant ${attrs.waitlistCount} personnes en attente. Vous pouvez créer un nouveau groupe.`;

      return this.repo.save(existingNotification);
    }

    const notification = this.repo.create({
      notificationType: AdminNotificationType.WAITLIST_GROUP_READY,
      title: 'Nouveau groupe recommandé',
      message: `Il y a ${attrs.waitlistCount} personnes en attente. Vous pouvez créer un nouveau groupe.`,
      courseId: attrs.courseId ?? null,
      serviceId: attrs.serviceId ?? null,
      waitlistCount: attrs.waitlistCount,
      read: false,
    });

    return this.repo.save(notification);
  }

  findAllUnread() {
    return this.repo.find({
      where: { read: false },
      order: { createdAt: 'DESC' },
    });
  }

  findAllNotifications() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findNotificationById(id: number) {
    const notification = await this.repo.findOneBy({ id });

    if (!notification) {
      throw new NotFoundException('Notification non trouvée');
    }

    return notification;
  }

  async markAsRead(id: number) {
    const notification = await this.findNotificationById(id);

    notification.read = true;

    return this.repo.save(notification);
  }

  async deleteNotification(id: number) {
    const notification = await this.findNotificationById(id);

    await this.repo.remove(notification);

    return {
      message: 'Notification supprimée avec succès',
    };
  }
}