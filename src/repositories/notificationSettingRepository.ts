import { UserAddress } from '../entities/userAddress';
import { NotificationType } from '../entities/notificationType';
import { NotificationSetting } from '../entities/notificationSetting';
import { errorMessages } from '../utils/errorMessages';

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

  // Global setting that controls all notifications
  const globalSetting: Partial<NotificationSetting> = {
    userAddress: user,
    isGlobalSetting: true,
  };
  typeSettings.push(globalSetting);

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
  allowNotifications?: boolean;
  allowEmailNotification?: boolean;
  allowDappPushNotification?: boolean;
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

  if (!notificationSetting)
    throw new Error(errorMessages.NOTIFICATION_SETTING_NOT_FOUND);

  if (params.allowNotifications != null)
    notificationSetting.allowNotifications = params.allowNotifications;
  if (params.allowEmailNotification != null)
    notificationSetting.allowEmailNotification = params.allowEmailNotification;
  if (params.allowDappPushNotification != null)
    notificationSetting.allowDappPushNotification =
      params.allowDappPushNotification;

  return notificationSetting.save();
};
