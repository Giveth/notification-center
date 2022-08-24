import { UserAddress } from '../entities/userAddress';
import { NotificationType } from '../entities/notificationType';
import { NotificationSetting } from '../entities/notificationSetting';
import { Notification } from '../entities/notification';
import { errorMessages } from '../utils/errorMessages';
import { query } from 'express';
import { NOTIFICATION_CATEGORY } from '../types/general';

export const markNotificationGroupAsRead = async (
  user: UserAddress,
  category?: string,
) => {
  let query = Notification.createQueryBuilder('notification')
    .select('notification.id')
    .innerJoinAndSelect('notification."notificationType"', 'notificationType')
    .where('notification."userAddressId" = :userAddressId', {
      userAddressId: user.id,
    })
    .andWhere('notification."isRead" = false');

  if (category) {
    query = query.andWhere('notificationType.category = :category', {
      category: category,
    });
  }
  const notifications = await query.getMany();

  const notificationsIds = notifications.map(notification => notification.id);
  const updateQuery = await markNotificationsAsRead(notificationsIds);

  return updateQuery.raw;
};

// returns raw data as array always
export const markNotificationsAsRead = async (
  ids: number[],
  userAddressId?: number,
) => {
  let updateQuery = Notification.createQueryBuilder('notification')
    .update<Notification>(Notification, { isRead: true })
    .where('notification.id IN (:...ids)');

  if (userAddressId) {
    updateQuery = updateQuery.andWhere(
      'notification.userAddressId = :userAddressId',
      { userAddressId: userAddressId },
    );
  }

  return updateQuery
    .setParameter('ids', ids)
    .returning('*')
    .updateEntity(true)
    .execute();
};

export const countUnreadNotifications = async (user: UserAddress) => {
  const [, total] = await baseNotificationQuery(user).getManyAndCount();
  const [, projectsRelated] = await baseNotificationQuery(user)
    .andWhere('notificationType.category = :category', {
      category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    })
    .getManyAndCount();
  const [, givEconomyRelated] = await baseNotificationQuery(user)
    .andWhere('notificationType.category = :category', {
      category: NOTIFICATION_CATEGORY.GENERAL,
    })
    .getManyAndCount();
  const [, general] = await baseNotificationQuery(user)
    .andWhere('notificationType.category = :category', {
      category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    })
    .getManyAndCount();

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
    let hasBeenRead = isRead === 'true' ? true : false;
    query = query.andWhere('notification."isRead" = :isRead', {
      isRead: hasBeenRead,
    });
  }

  return query.take(limit).skip(offset).getManyAndCount();
};

export const createNotification = async (
  user: UserAddress,
  emailStatus?: string,
  email?: string,
  emailContent?: string,
  data?: any,
  metadata?: any,
) => {
  // TODO implement this logic
}
