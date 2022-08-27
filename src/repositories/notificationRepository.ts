import {UserAddress} from '../entities/userAddress';
import {NotificationType} from '../entities/notificationType';
import {NotificationSetting} from '../entities/notificationSetting';
import {Notification} from '../entities/notification';
import {errorMessages} from '../utils/errorMessages';
import {query} from 'express';
import {NOTIFICATION_CATEGORY} from '../types/general';
import {CountUnreadNotificationsResponse} from '../types/requestResponses';
import {getNotificationTypeByEventName} from './notificationTypeRepository';
import {logger} from '../utils/logger';

export const markNotificationGroupAsRead = async (
    user: UserAddress,
    category?: string,
): Promise<void> => {
    let query = Notification.createQueryBuilder('notification')
        .innerJoinAndSelect('notification."notificationType"', 'notificationType')
        .update<Notification>(Notification, {isRead: true})
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
    params: {
        notificationId: number,
        userAddressId: number,
    }
): Promise<Notification | undefined> => {
    // TODO as I changed markNotificationGroupAsRead, we should change this function to just get one id and update that notificaiton
    const updateResult = await Notification.createQueryBuilder('notification')
        .update<Notification>(Notification, {isRead: true})
        .where(
            'notification."userAddressId" = :userAddressId',
            {userAddressId: params.userAddressId},
        )
        .andWhere("notification.id = :id", {
            id: params.notificationId
        })
        .returning('*')
        .updateEntity(true)
        .execute()
    const [notification] = updateResult.raw
    return notification


};

export const countUnreadNotifications = async (
    user: UserAddress,
): Promise<CountUnreadNotificationsResponse> => {
    const total = await baseNotificationQuery(user).andWhere('notification."isRead" = false',)
        .getCount();
    const projectsRelated = await baseNotificationQuery(user)
        .andWhere('notification."isRead" = false',)
        .andWhere('notificationType.category = :category', {
            category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
        })
        .getCount();
    const givEconomyRelated = await baseNotificationQuery(user).andWhere('notification."isRead" = false',)

        .andWhere('notificationType.category = :category', {
            category: NOTIFICATION_CATEGORY.GENERAL,
        })
        .getCount();
    const general = await baseNotificationQuery(user).andWhere('notification."isRead" = false',)

        .andWhere('notificationType.category = :category', {
            category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
        })
        .getCount();
    const lastNotification = await baseNotificationQuery(user).orderBy('notification.id', 'DESC').getOne()

    return {
        lastNotificationId: lastNotification?.id,
        total,
        general,
        projectsRelated,
        givEconomyRelated,
    };
};

export const baseNotificationQuery = (user: UserAddress) => {

    return Notification.createQueryBuilder('notification')
        .innerJoinAndSelect('notification.notificationType', 'notificationType')
        .where('notification."userAddressId" = :userAddressId', {
            userAddressId: user.id,
        })
};

export const getNotifications = async (params: {
    userAddressId: number,
    category?: string,
    projectId?: string,
    limit?: number,
    startTime?: number,
    skip?: number,
    isRead?: string
}) => {
    const {
        userAddressId,
        category,
        startTime,
        projectId,
        limit,
        skip,
        isRead,
    } = params
    let query = Notification.createQueryBuilder('notification')
        .innerJoinAndSelect('notification.notificationType', 'notificationType')
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

    return query.take(limit).skip(skip).getManyAndCount();
};

export const createNotification = async (
    params: {
        notificationType: NotificationType,
        user: UserAddress,
        email?: string,
        emailStatus?: string,
        metadata?: any,
        projectId?: string
    }
) => {
    const {
        notificationType, user, projectId,
        email, emailStatus, metadata
    } = params;

    const notification = Notification.create({
        userAddress: user,
        email: email,
        metadata: metadata,
        emailStatus,
        projectId,
        notificationType,
    });

    return notification.save();
};
