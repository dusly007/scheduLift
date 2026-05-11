import { Controller, Delete, Get, Param, Patch,Post } from '@nestjs/common';
import { AdminNotificationsService } from './admin-notifications.service';

@Controller('admin/notifications')
export class AdminNotificationsController {
  constructor(private readonly adminNotificationsService: AdminNotificationsService) {}

  @Get()
  findAllUnread() {
    return this.adminNotificationsService.findAllUnread();
  }

  @Get('/all')
  findAllNotifications() {
    return this.adminNotificationsService.findAllNotifications();
  }

  @Get(':id')
  findNotificationById(@Param('id') id: string) {
    return this.adminNotificationsService.findNotificationById(Number(id));
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.adminNotificationsService.markAsRead(Number(id));
  }

  @Delete(':id')
  deleteNotification(@Param('id') id: string) {
    return this.adminNotificationsService.deleteNotification(Number(id));
  }

  @Post('/test')
  createTestNotification() {
  return this.adminNotificationsService.createWaitlistGroupReadyNotification({
    courseId: 1,
    waitlistCount: 1,
  });
}
}