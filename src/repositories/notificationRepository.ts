import { UserAddress } from '../entities/userAddress';
import { NotificationType } from '../entities/notificationType';
import { NotificationSetting } from '../entities/notificationSetting';
import { Notification } from '../entities/notification';
import { errorMessages } from '../utils/errorMessages';
import { query } from 'express';
import { NOTIFICATION_CATEGORY } from '../types/general';
import { CountUnreadNotificationsResponse } from '../types/requestResponses';
import { getNotificationTypeByEventName } from './notificationTypeRepository';

export const markNotificationGroupAsRead = async (
  user: UserAddress,
  category?: string,
): Promise<void> => {
  let query = Notification.createQueryBuilder('notification')
    .innerJoinAndSelect('notification."notificationType"', 'notificationType')
    .update<Notification>(Notification, { isRead: true })
    .where('notification."userAddressId" = :userAddressId', {
      userAddressId: user.id,
    })
    .andWhere('notification."isRead" = false');

  if (category) {
    query = query.andWhere('notificationType.category = :category', {
      category: category,
    });
  }
  await query.execute();
};

// returns raw data as array always
export const markNotificationsAsRead = async (
  ids: number[],
  userAddressId?: number,
): Promise<Notification[]> => {
  // TODO as I changed markNotificationGroupAsRead, we should change this function to just get one id and update that notificaiton
  let updateQuery = Notification.createQueryBuilder('notification')
    .update<Notification>(Notification, { isRead: true })
    .where('notification.id IN (:...ids)');

  if (userAddressId) {
    updateQuery = updateQuery.andWhere(
      'notification.userAddressId = :userAddressId',
      { userAddressId: userAddressId },
    );
  }

  const result = await updateQuery
    .setParameter('ids', ids)
    .returning('*')
    .updateEntity(true)
    .execute();
  return result.raw;
};

export const countUnreadNotifications = async (
  user: UserAddress,
): Promise<CountUnreadNotificationsResponse> => {
  const total = await baseNotificationQuery(user).getCount();
  const projectsRelated = await baseNotificationQuery(user)
    .andWhere('notificationType.category = :category', {
      category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    })
    .getCount();
  const givEconomyRelated = await baseNotificationQuery(user)
    .andWhere('notificationType.category = :category', {
      category: NOTIFICATION_CATEGORY.GENERAL,
    })
    .getCount();
  const general = await baseNotificationQuery(user)
    .andWhere('notificationType.category = :category', {
      category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    })
    .getCount();

  return {
    total,
    general,
    projectsRelated,
    givEconomyRelated,
  };
};

export const baseNotificationQuery = (user: UserAddress) => {
  return Notification.createQueryBuilder('notification')
    .innerJoinAndSelect('notification."notificationType"', 'notificationType')
    .where('notification."userAddressId" = :userAddressId', {
      userAddressId: user.id,
    });
};

export const getNotifications = async (
  userAddressId: number,
  category?: string,
  projectId?: string,
  limit?: number,
  offset?: number,
  isRead?: string,
) => {
  let query = Notification.createQueryBuilder('notification')
    .innerJoinAndSelect('notification."notificationType"', 'notificationType')
    .where('notification."userAddressId" = :userAddressId', {
      userAddressId: userAddressId,
    });

  if (category) {
    query = query.andWhere('notificationType.category = :category', {
      category: category,
    });
  }

  if (projectId) {
    query = query.andWhere('notification.projectId = :projectId', {
      projectId: projectId,
    });
  }

  if (isRead) {
    query = query.andWhere('notification."isRead" = :isRead', {
      isRead: isRead === 'true',
    });
  }

  return query.take(limit).skip(offset).getManyAndCount();
};

export const createNotification = async (
  notificationType: NotificationType,
  user: UserAddress,
  email?: string,
  data?: any,
  metadata?: any,
) => {
  const notification = Notification.create({
    userAddressId: user.id,
    email: email,
    data: data,
    metadata: metadata,
    typeId: notificationType.id,
  });

  return notification.save();
};
