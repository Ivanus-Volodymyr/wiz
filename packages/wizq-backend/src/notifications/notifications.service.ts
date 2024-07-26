import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GeneralResponse } from '../types/index';
import prisma from '../prisma';
import { CreateNotificationsDto } from './dto/create-notifications-dto';

@Injectable()
export class NotificationsService {
  public async createNotification(
    notification: CreateNotificationsDto,
  ): Promise<GeneralResponse> {
    try {
      const details = await prisma.notification.create({
        data: {
          ...notification,
          is_read: false,
        },
        include: {
          author: true,
          projectProposal: {
            include: {
              project: true,
            },
          },
          projectInvitation: {
            include: {
              project: true,
            },
          },
        },
      });

      return {
        status: HttpStatus.CREATED,
        message: 'notification created',
        details,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error with creating notification',
        error: e,
      };
    }
  }

  public async getUserNotifications(userId: string): Promise<GeneralResponse> {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          receiverId: userId,
        },
        include: {
          author: true,
          projectProposal: {
            include: {
              project: true,
            },
          },
          projectInvitation: {
            include: {
              project: true,
            },
          },
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'user notifications',
        details: notifications.map((notification) => {
          const { id, type, ...res } = notification;
          return { id, type, details: { ...res } };
        }),
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error getting user notifications',
        error: e,
      };
    }
  }

  public async updateNotification(
    notificationId: string,
    dataToUpdate: Partial<CreateNotificationsDto>,
  ): Promise<GeneralResponse> {
    try {
      const foundNotification = await prisma.notification.findUnique({
        where: {
          id: notificationId,
        },
      });

      if (!foundNotification) {
        throw new HttpException(`not found`, HttpStatus.NOT_FOUND);
      }

      const details = await prisma.notification.update({
        where: { id: notificationId },
        data: dataToUpdate,
      });

      return {
        status: HttpStatus.OK,
        message: 'notification successfully updated',
        details,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_MODIFIED,
        message: 'error updating notification',
        error: e,
      };
    }
  }

  public async deleteNotification(
    notificationId: string,
  ): Promise<GeneralResponse> {
    try {
      const foundNotification = await prisma.notification.findUnique({
        where: {
          id: notificationId,
        },
      });

      if (!foundNotification) {
        throw new HttpException(`not found`, HttpStatus.NOT_FOUND);
      }

      const details = await prisma.notification.delete({
        where: { id: notificationId },
      });

      return {
        status: HttpStatus.OK,
        message: 'notification successfully deleted',
        details,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_MODIFIED,
        message: 'error deleting notification',
        error: e,
      };
    }
  }
}
