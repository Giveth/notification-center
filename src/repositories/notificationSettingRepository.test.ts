import { assert } from 'chai';
import { generateRandomEthereumAddress } from '../../test/testUtils';
import {
  NOTIFICATION_CATEGORY_GROUPS,
  NotificationSetting,
} from '../entities/notificationSetting';
import {
  findNotificationSettingByCategoryGroupAndUserAddress,
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

function findNotificationSettingByNotificationTypeAndUserAddressTestCases() {
  it('return notification settings for userAddress and notificationType', async () => {
    const address = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(address);
    const notificationType = await getNotificationTypeByEventName(
      SegmentEvents.PROJECT_LISTED,
    );
    const notificationSettings =
      await findNotificationSettingByCategoryGroupAndUserAddress({
        userAddressId: userAddress.id,
        categoryGroup: notificationType?.categoryGroup as string,
      });

    assert.isOk(notificationSettings);
    assert.equal(
      notificationSettings?.notificationType?.categoryGroup,
      notificationType?.categoryGroup,
    );
    assert.isTrue(notificationSettings?.notificationType?.isGroupParent);
    assert.equal(notificationSettings?.userAddressId, userAddress?.id);
  });
  it('return null for invalid  categoryGroup', async () => {
    const address = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(address);
    const notificationSettings =
      await findNotificationSettingByCategoryGroupAndUserAddress({
        userAddressId: userAddress.id,
        categoryGroup: 'invalid category group',
      });

    assert.isNull(notificationSettings);
  });

  it('return null for invalid userAddress', async () => {
    const notificationType = await getNotificationTypeByEventName(
      SegmentEvents.PROJECT_LISTED,
    );
    const notificationSettings =
      await findNotificationSettingByCategoryGroupAndUserAddress({
        userAddressId: 99999,
        categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS,
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
