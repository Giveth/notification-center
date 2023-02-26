import { UserAddress } from '../entities/userAddress';
import { NotificationType } from '../entities/notificationType';
import { NotificationSetting } from '../entities/notificationSetting';
import { errorMessages } from '../utils/errorMessages';
import { createQueryBuilder } from 'typeorm';
import { logger } from '../utils/logger';
import { StandardError } from '../types/StandardError';
import { findNotificationTypeParent } from './notificationTypeRepository';

export const createNotificationSettingsForNewUser = async (
  user: UserAddress,
) => {
  const notificationTypes = await NotificationType.find();
  // rest of values are set by default
  const notificationTypeSettings = [];
  for (const notificationType of notificationTypes) {
    const notificationParent = notificationType?.isGroupParent
      ? notificationType
      : await findNotificationTypeParent(
          notificationType.categoryGroup as string,
        );
    const payload: Partial<NotificationSetting> = {
      notificationType: notificationType,
      userAddress: user,
      allowEmailNotification:
        notificationParent?.emailDefaultValue !== undefined
          ? notificationParent?.emailDefaultValue
          : true,
      allowDappPushNotification:
        notificationParent?.webDefaultValue !== undefined
          ? notificationParent?.webDefaultValue
          : true,
    };
    logger.info('createNotificationSettingsForNewUser**', {
      payload,
      notificationType,
      notificationParent
    })

    notificationTypeSettings.push(payload);
  }

  const userSettings = NotificationSetting.create(notificationTypeSettings);

  return await NotificationSetting.save(userSettings);
};

export const getUserNotificationSettings = async (
  take: number,
  skip: number,
  userAddressId: number,
  category?: string,
) => {
  let query = NotificationSetting.createQueryBuilder('notificationSetting')
    .leftJoinAndSelect(
      'notificationSetting.notificationType',
      'notificationType',
    )
    .where('notificationSetting.userAddressId = :userAddressId', {
      userAddressId: userAddressId,
    })
    .andWhere('notificationType.showOnSettingPage = true');

  if (category) {
    query = query.andWhere('notificationType.category = :category', {
      category: category,
    });
  }
  query.orderBy('notificationType.id', 'ASC');
  return query.take(take).skip(skip).getManyAndCount();
};

export const findNotificationSettingByNotificationTypeAndUserAddress =
  async (params: {
    notificationTypeId: number;
    userAddressId: number;
  }): Promise<NotificationSetting | null> => {
    const { notificationTypeId, userAddressId } = params;
    try {
      return await NotificationSetting.createQueryBuilder('notificationSetting')
        .where('notificationSetting.userAddressId = :userAddressId', {
          userAddressId,
        })
        .andWhere(
          'notificationSetting.notificationTypeId = :notificationTypeId',
          {
            notificationTypeId,
          },
        )
        .getOne();
    } catch (e) {
      logger.error(
        'findNotificationSettingByNotificationTypeAndUserAddress() error',
        e,
      );
      throw e;
    }
  };

export const findNotificationSettingById = async (
  id: number,
): Promise<NotificationSetting | null> => {
  try {
    return await NotificationSetting.createQueryBuilder('notificationSetting')
      .leftJoinAndSelect(
        'notificationSetting.notificationType',
        'notificationType',
      )
      .where('notificationSetting.id = :id', {
        id,
      })
      .getOne();
  } catch (e) {
    logger.error(
      'findNotificationSettingByNotificationTypeAndUserAddress() error',
      e,
    );
    throw e;
  }
};

export const updateUserNotificationSetting = async (params: {
  notificationSettingId: number;
  userAddressId: number;
  allowEmailNotification: boolean;
  allowDappPushNotification: boolean;
}): Promise<NotificationSetting> => {
  const notificationSetting = await NotificationSetting.createQueryBuilder(
    'notificationSetting',
  )
    .leftJoinAndSelect(
      'notificationSetting.notificationType',
      'notificationType',
    )
    .where(
      'notificationSetting.id = :id AND notificationSetting.userAddressId = :userAddressId',
      {
        id: params.notificationSettingId,
        userAddressId: params.userAddressId,
      },
    )
    .getOne();

  if (!notificationSetting) {
    throw new StandardError({
      message: errorMessages.NOTIFICATION_SETTING_NOT_FOUND,
      httpStatusCode: 400,
    });
  }
  if (notificationSetting.notificationType?.isEmailEditable) {
    notificationSetting.allowEmailNotification = params.allowEmailNotification;
  }
  if (notificationSetting.notificationType?.isWebEditable) {
    notificationSetting.allowDappPushNotification =
      params.allowDappPushNotification;
  }

  if (
    notificationSetting?.notificationType?.isGroupParent &&
    notificationSetting?.notificationType?.categoryGroup
  ) {
    await updateChildNotificationSettings({
      categoryGroup: notificationSetting?.notificationType?.categoryGroup,
      userAddressId: params.userAddressId,
      allowEmailNotification: notificationSetting.allowEmailNotification,
      allowDappPushNotification: notificationSetting.allowDappPushNotification,
    });
  }
  return notificationSetting.save();
};

export const updateChildNotificationSettings = async (params: {
  categoryGroup: string;
  userAddressId: number;
  allowEmailNotification: boolean;
  allowDappPushNotification: boolean;
}) => {
  // Grab type ids
  const notificationTypes = await NotificationType.createQueryBuilder(
    'notificationType',
  )
    .select('notificationType.id')
    .where('notificationType.categoryGroup = :categoryGroup', {
      categoryGroup: params.categoryGroup,
    })
    .andWhere('notificationType.isGroupParent = false')
    .getMany();

  const notificationTypeIds = notificationTypes.map(notificationType => {
    return notificationType.id;
  });

  if (notificationTypeIds.length === 0) return;

  await NotificationSetting.query(`
        UPDATE notification_setting
        SET "allowEmailNotification" = ${
          params.allowEmailNotification
        }, "allowDappPushNotification" = ${params.allowDappPushNotification}
        WHERE "notificationTypeId" IN (${notificationTypeIds.join(
          ',',
        )}) AND "userAddressId" = ${params.userAddressId}
  `);
};
