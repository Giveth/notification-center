import { assert } from 'chai';
import {
  generateRandomEthereumAddress,
  serverUrl,
} from '../../../test/testUtils';
import { createNewUserAddressIfNotExists } from '../../repositories/userAddressRepository';
import Axios from 'axios';
import jwt from 'jsonwebtoken';
import {
  NotificationSetting,
  NOTIFICATION_CATEGORY_GROUPS,
} from '../../entities/notificationSetting';
import { NOTIFICATION_CATEGORY } from '../../types/general';
import { not } from 'joi';

const apiBaseUrl = serverUrl;

describe(
  '/notification_settings GET test cases',
  getNotificationSettingsTestCases,
);
describe(
  '/notification_settings/:id PUT test cases',
  updateNotificationsTestCases,
);
describe(
  '/notification_settings PUT test cases',
  updateMultipleNotificationsTestCases,
);

const walletAddress = generateRandomEthereumAddress().toLowerCase();
const walletAddress2 = generateRandomEthereumAddress().toLowerCase();

function getNotificationSettingsTestCases() {
  it('should return success response', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const jwtToken = jwt.sign({ publicAddress: walletAddress }, 'xxxx');
    const result = await Axios.get(`${apiBaseUrl}/v1/notification_settings`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const notifications = result.data.notificationSettings;
    assert.isOk(notifications);
    assert.isTrue(notifications[0].userAddressId === userAddress.id);
  });
  it('should return addresses filtered by category', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const jwtToken = jwt.sign({ publicAddress: walletAddress }, 'xxxx');
    const category = NOTIFICATION_CATEGORY.PROJECT_RELATED;
    const result = await Axios.get(
      `${apiBaseUrl}/v1/notification_settings?limit=10&category=${category}`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      },
    );
    const notifications = result.data.notificationSettings;
    assert.isOk(notifications);
    assert.isTrue(notifications[0]?.userAddressId === userAddress.id);
    assert.isTrue(notifications[0]?.notificationType?.category === category);
    assert.isTrue(notifications[0]?.notificationType?.showOnSettingPage);
  });
}

function updateNotificationsTestCases() {
  it('should update notification setting', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationSetting = await NotificationSetting.createQueryBuilder(
      'notificationSetting',
    )
      .leftJoinAndSelect(
        'notificationSetting.notificationType',
        'notificationType',
      )
      .where('notificationSetting.userAddressId = :id', { id: userAddress.id })
      .andWhere('notificationType.isEmailEditable = true')
      .andWhere('notificationType.isWebEditable = true')
      .getOne();
    const jwtToken = jwt.sign({ publicAddress: walletAddress }, 'xxxx');
    const result = await Axios.put(
      `${apiBaseUrl}/v1/notification_settings/${notificationSetting?.id}`,
      {
        id: notificationSetting!.id,
        allowEmailNotification: false,
        allowDappPushNotification: false,
      },
      { headers: { Authorization: `Bearer ${jwtToken}` } },
    );

    const updatedNotification = result.data;
    assert.isOk(result);

    assert.isFalse(updatedNotification.allowEmailNotification);
    assert.isFalse(updatedNotification.allowDappPushNotification);
    //validate child notifications of the group are updated
    const updatedChildSettings = await NotificationSetting.createQueryBuilder(
      'notificationSetting',
    )
      .leftJoinAndSelect(
        'notificationSetting.notificationType',
        'notificationType',
      )
      .where('notificationSetting.userAddressId = :id', { id: userAddress.id })
      .andWhere(
        'notificationType.isGroupParent = false AND notificationType.categoryGroup = :categoryGroup',
        { categoryGroup: NOTIFICATION_CATEGORY_GROUPS.GIVPOWER_ALLOCATIONS },
      )
      .getMany();

    updatedChildSettings.forEach(setting => {
      assert.isTrue(setting.allowNotifications);
      assert.isTrue(setting.allowEmailNotification);
      assert.isTrue(setting.allowDappPushNotification);
    });
  });
  it('should update notification setting, when isEmailEditable is false should not change email setting', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationSetting = await NotificationSetting.createQueryBuilder(
      'notificationSetting',
    )
      .leftJoinAndSelect(
        'notificationSetting.notificationType',
        'notificationType',
      )
      .where('notificationSetting.userAddressId = :id', { id: userAddress.id })
      .andWhere('notificationType.isEmailEditable = false')
      .andWhere('notificationSetting.allowDappPushNotification = true')
      .getOne();
    const jwtToken = jwt.sign({ publicAddress: walletAddress }, 'xxxx');
    const result = await Axios.put(
      `${apiBaseUrl}/v1/notification_settings/${notificationSetting?.id}`,
      {
        id: notificationSetting!.id,
        allowEmailNotification: false,
        allowDappPushNotification: false,
      },
      { headers: { Authorization: `Bearer ${jwtToken}` } },
    );

    const updatedNotification = result.data;
    assert.isOk(result);

    assert.isTrue(updatedNotification.allowEmailNotification);
  });
  it('should update notification setting, when isWebEditable is false should not change dapp push notification setting', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationSetting = await NotificationSetting.createQueryBuilder(
      'notificationSetting',
    )
      .leftJoinAndSelect(
        'notificationSetting.notificationType',
        'notificationType',
      )
      .where('notificationSetting.userAddressId = :id', { id: userAddress.id })
      .andWhere('notificationType.isWebEditable = false')
      .andWhere('notificationSetting.allowDappPushNotification = true')
      .getOne();
    const jwtToken = jwt.sign({ publicAddress: walletAddress }, 'xxxx');
    const result = await Axios.put(
      `${apiBaseUrl}/v1/notification_settings/${notificationSetting?.id}`,
      {
        id: notificationSetting!.id,
        allowEmailNotification: false,
        allowDappPushNotification: false,
      },
      { headers: { Authorization: `Bearer ${jwtToken}` } },
    );

    const updatedNotification = result.data;
    assert.isOk(result);

    assert.isTrue(updatedNotification.allowDappPushNotification);
  });
}

function updateMultipleNotificationsTestCases() {
  it('should update notification settings', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress2);
    const notificationSettings = await NotificationSetting.createQueryBuilder(
      'notificationSetting',
    )
      .leftJoinAndSelect(
        'notificationSetting.notificationType',
        'notificationType',
      )
      .where('notificationSetting.userAddressId = :id', { id: userAddress.id })
      .andWhere('notificationType.isEmailEditable = true')
      .andWhere('notificationType.isWebEditable = true')
      .take(2)
      .getMany();

    const jwtToken = jwt.sign({ publicAddress: walletAddress2 }, 'xxxx');
    const result = await Axios.put(
      `${apiBaseUrl}/v1/notification_settings`,
      {
        settings: notificationSettings.map(setting => {
          return {
            id: setting!.id,
            allowEmailNotification: false,
            allowDappPushNotification: false,
          };
        }),
      },
      { headers: { Authorization: `Bearer ${jwtToken}` } },
    );

    const updatedNotifications: any[] = Object.values(result.data);
    assert.isOk(result);
    // didnt update this value so it remains true
    assert.isTrue(updatedNotifications[0].allowNotifications);
    assert.isTrue(updatedNotifications[1].allowNotifications);

    const updatedNotification1 = updatedNotifications.find((setting: any) => {
      return setting.id === notificationSettings[0].id;
    });

    const updatedNotification2 = updatedNotifications.find((setting: any) => {
      return setting.id === notificationSettings[1].id;
    });

    // notification 1
    assert.isTrue(
      updatedNotification1.allowNotifications ===
        notificationSettings[0]?.allowNotifications,
    );
    assert.isFalse(updatedNotification1.allowEmailNotification);
    assert.isTrue(
      updatedNotification1.allowEmailNotification !==
        notificationSettings[0]?.allowEmailNotification,
    );
    assert.isFalse(updatedNotification1.allowDappPushNotification);
    assert.isTrue(
      updatedNotification1.allowDappPushNotification !==
        notificationSettings[0]?.allowDappPushNotification,
    );

    // notification 2
    assert.isTrue(
      updatedNotification2.allowNotifications ===
        notificationSettings[1]?.allowNotifications,
    );
    assert.isFalse(updatedNotification2.allowEmailNotification);
    assert.isTrue(
      updatedNotification2.allowEmailNotification !==
        notificationSettings[1]?.allowEmailNotification,
    );
    assert.isFalse(updatedNotification2.allowDappPushNotification);
    assert.isTrue(
      updatedNotification2.allowDappPushNotification !==
        notificationSettings[1]?.allowDappPushNotification,
    );
  });
}
