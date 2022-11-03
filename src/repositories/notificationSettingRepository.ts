import { UserAddress } from '../entities/userAddress';
import { NotificationType } from '../entities/notificationType';
import { NotificationSetting } from '../entities/notificationSetting';
import { errorMessages } from '../utils/errorMessages';
import { createQueryBuilder } from 'typeorm';

export const createNotificationSettingsForNewUser = async (
  user: UserAddress,
) => {
  const notificationTypes = await NotificationType.find();
  // rest of values are set by default
  const typeSettings = notificationTypes.map(notificationType => {
    const payload: Partial<NotificationSetting> = {
      notificationType: notificationType,
      userAddress: user,
    };

    return payload;
  });

  const userSettings = NotificationSetting.create(typeSettings);

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
    });

  if (category) {
    query = query.andWhere('notificationType.category = :category', {
      category: category,
    });
  }

  return query.take(take).skip(skip).getManyAndCount();
};

export const updateUserNotificationSetting = async (params: {
  notificationSettingId: number;
  userAddressId: number;
  allowNotifications?: string;
  allowEmailNotification?: string;
  allowDappPushNotification?: string;
}) => {
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

  console.log('user id ' + params.userAddressId);
  console.log('notif id ' + params.notificationSettingId);

  if (!notificationSetting)
    throw new Error(errorMessages.NOTIFICATION_SETTING_NOT_FOUND);

  if (params.allowNotifications)
    notificationSetting.allowNotifications =
      params.allowNotifications === 'true';
  if (params.allowEmailNotification)
    notificationSetting.allowEmailNotification =
      params.allowEmailNotification === 'true';
  if (params.allowDappPushNotification)
    notificationSetting.allowDappPushNotification =
      params.allowDappPushNotification === 'true';

  if (
    notificationSetting?.notificationType?.isGroupParent &&
    notificationSetting?.notificationType?.categoryGroup
  ) {
    await updateChildNotificationSettings({
      categoryGroup: notificationSetting?.notificationType?.categoryGroup,
      userAddressId: params.userAddressId,
      allowNotifications: notificationSetting.allowNotifications,
      allowEmailNotification: notificationSetting.allowEmailNotification,
      allowDappPushNotification: notificationSetting.allowDappPushNotification,
    });
  }

  return notificationSetting.save();
};

export const updateChildNotificationSettings = async (params: {
  categoryGroup: string;
  userAddressId: number;
  allowNotifications?: boolean;
  allowEmailNotification?: boolean;
  allowDappPushNotification?: boolean;
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
    SET "allowNotifications" = ${
      params.allowNotifications
    }, "allowEmailNotification" = ${
    params.allowEmailNotification
  }, "allowDappPushNotification" = ${params.allowDappPushNotification}
    WHERE "notificationTypeId" IN (${notificationTypeIds.join(
      ',',
    )}) AND "userAddressId" = ${params.userAddressId}
  `);
};
