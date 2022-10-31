import { assert } from 'chai';
import { generateRandomEthereumAddress } from '../../test/testUtils';
import { NotificationSetting } from '../entities/notificationSetting';
import {
  getUserNotificationSettings,
  updateUserNotificationSetting,
} from './notificationSettingRepository';
import { createNewUserAddressIfNotExists } from './userAddressRepository';

// createNotificationSettingsForNewUser tested in userRepository
describe(
  'getUserNotificationSettings() test cases',
  getUserNotificationSettingsTestCases,
);

describe(
  'updateUserNotificationSetting() test cases',
  updateUserNotificationSettingTestCases,
);

const walletAddress = generateRandomEthereumAddress();

function getUserNotificationSettingsTestCases() {
  it('return notification settings by user and take and skip', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const take = 2;
    const skip = 0;

    const [notificationSettings] = await getUserNotificationSettings(
      take,
      skip,
      userAddress.id,
    );

    assert.isOk(notificationSettings);
    assert.isTrue(notificationSettings!.length === 2);
    notificationSettings.forEach(setting => {
      assert.isTrue(setting!.userAddressId === userAddress.id);
    });
  });
}

function updateUserNotificationSettingTestCases() {
  it('update user notification settings', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);

    const userNotificationSetting =
      await NotificationSetting.createQueryBuilder('setting')
        .leftJoinAndSelect('setting.notificationType', 'notificationType')
        .where('setting."userAddressId" = :userAddressId', {
          userAddressId: userAddress.id,
        })
        .andWhere('notificationType.isGroupParent = false')
        .getOne();

    assert.isTrue(userNotificationSetting?.userAddressId === userAddress.id);

    const updatedSetting = await updateUserNotificationSetting({
      notificationSettingId: userNotificationSetting!.id,
      userAddressId: userAddress.id,
      allowNotifications: 'false',
      allowEmailNotification: 'false',
      allowDappPushNotification: 'false',
    });

    assert.isOk(updatedSetting);
    assert.isTrue(
      userNotificationSetting!.allowNotifications !==
        updatedSetting!.allowNotifications,
    );
    assert.equal(userNotificationSetting!.allowNotifications, true);
    assert.equal(updatedSetting.allowNotifications, false);
    assert.equal(updatedSetting.allowEmailNotification, false);
    assert.equal(updatedSetting.allowDappPushNotification, false);
  });
}
