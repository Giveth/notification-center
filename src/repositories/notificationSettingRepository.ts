import { UserAddress } from '../entities/userAddress';
import { NotificationType } from '../entities/notificationType';
import { NotificationSetting } from '../entities/notificationSetting';

export const createNotificationSettingsForNewUser = async (
  user: UserAddress,
): Promise<NotificationSetting> => {
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

  // return await NotificationSetting.insert(userSettings);

  return NotificationSetting.create();
};
