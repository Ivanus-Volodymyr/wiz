import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';

import { GeneralResponse } from '../types';
import { NotificationsService } from './notifications.service';
import { CreateNotificationsDto } from './dto/create-notifications-dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('/user/:userId')
  public async getUserNotifications(
    @Param('userId') userId: string,
  ): Promise<GeneralResponse> {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch('/:notificationId')
  public async updateNotification(
    @Param('notificationId') notificationId: string,
    @Body() dataToUpdate: Partial<CreateNotificationsDto>,
  ): Promise<GeneralResponse> {
    return this.notificationsService.updateNotification(
      notificationId,
      dataToUpdate,
    );
  }

  @Delete('/:notificationId')
  public async deleteNotification(
    @Param('notificationId') notificationId: string,
  ): Promise<GeneralResponse> {
    return this.notificationsService.deleteNotification(notificationId);
  }
}
