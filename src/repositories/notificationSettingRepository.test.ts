import { assert } from 'chai';
import { generateRandomEthereumAddress } from '../../test/testUtils';
import { NotificationSetting } from '../entities/notificationSetting';
import {
  findNotificationSettingByNotificationTypeAndUserAddress,
  getUserNotificationSettings,
  updateUserNotificationSetting,
} from './notificationSettingRepository';
import { createNewUserAddressIfNotExists } from './userAddressRepository';
import { getNotificationTypeByEventName } from './notificationTypeRepository';
import { SegmentEvents } from '../services/segment/segmentAnalyticsSingleton';

// createNotificationSettingsForNewUser tested in userRepository
describe(
  'getUserNotificationSettings() test cases',
  getUserNotificationSettingsTestCases,
);

describe(
  'updateUserNotificationSetting() test cases',
  updateUserNotificationSettingTestCases,
);
describe(
  'findNotificationSettingByNotificationTypeAndUserAddress() test cases',
  findNotificationSettingByNotificationTypeAndUserAddressTestCases,
);

const walletAddress = generateRandomEthereumAddress();

function getUserNotificationSettingsTestCases() {
  it('return notification settings by user and take and skip', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const take = 50;
    const skip = 0;

    const [notificationSettings] = await getUserNotificationSettings(
      take,
      skip,
      userAddress.id,
    );

    assert.isOk(notificationSettings);
    notificationSettings.forEach(setting => {
      assert.isTrue(setting!.userAddressId === userAddress.id);
      assert.isTrue(setting?.notificationType?.showOnSettingPage);
    });
  });
}

function findNotificationSettingByNotificationTypeAndUserAddressTestCases() {
  it('return notification settings for userAddress and notificationType', async () => {
    const address = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(address);
    const notificationType = await getNotificationTypeByEventName(
      SegmentEvents.PROJECT_LISTED,
    );
    const notificationSettings =
      await findNotificationSettingByNotificationTypeAndUserAddress({
        userAddressId: userAddress.id,
        notificationTypeId: notificationType?.id as number,
      });

    assert.isOk(notificationSettings);
    assert.equal(
      notificationSettings?.notificationTypeId,
      notificationType?.id,
    );
    assert.equal(notificationSettings?.userAddressId, userAddress?.id);
  });
  it('return null for invalid  notificationType', async () => {
    const address = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(address);
    const notificationSettings =
      await findNotificationSettingByNotificationTypeAndUserAddress({
        userAddressId: userAddress.id,
        notificationTypeId: 999999,
      });

    assert.isNull(notificationSettings);
  });

  it('return null for invalid notificationAddress', async () => {
    const notificationType = await getNotificationTypeByEventName(
      SegmentEvents.PROJECT_LISTED,
    );
    const notificationSettings =
      await findNotificationSettingByNotificationTypeAndUserAddress({
        userAddressId: 99999,
        notificationTypeId: notificationType?.id as number,
      });
    assert.isNull(notificationSettings);
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
