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
      typeId: notificationType.id,
      userAddressId: user.id,
    };

    return payload;
  });

  // Global setting that controls all notifications
  const globalSetting: Partial<NotificationSetting> = {
    typeId: null,
    userAddressId: user.id,
  };
  typeSettings.push(globalSetting);

  const userSettings = NotificationSetting.create(typeSettings);

  return await NotificationSetting.insert(userSettings);
};

export const getUserNotificationSettings = async (
  take: number,
  skip: number,
  userAddressId: number,
  category?: string,
) => {
  let query = NotificationSetting.createQueryBuilder().where(
    '"userAddressId" = :userAddressId',
    { userAddressId: userAddressId },
  );

  if (category) {
    query = query.andWhere('category = :category', { category: category });
  }

  return query.take(take).skip(skip).getManyAndCount();
};

export const updateUserNotificationSetting = async (
  notificationId: number,
  userAddressId: number,
  allowNotifications?: string,
  allowEmailNotification?: string,
  allowDappPushNotification?: string,
) => {
  const notificationSetting = await NotificationSetting.createQueryBuilder()
    .where('id = :id AND "userAddressId" = :userAddressId', {
      id: notificationId,
      userAddressId: userAddressId,
    })
    .getOne();

  if (!notificationSetting)
    throw new Error(errorMessages.NOTIFICATION_SETTING_NOT_FOUND);

  if (allowNotifications)
    notificationSetting.allowNotifications = allowNotifications === 'true';
  if (allowEmailNotification)
    notificationSetting.allowEmailNotification =
      allowEmailNotification === 'true';
  if (allowDappPushNotification)
    notificationSetting.allowDappPushNotification =
      allowDappPushNotification === 'true';

  return notificationSetting.save();
};
