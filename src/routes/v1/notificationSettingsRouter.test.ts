import { assert } from 'chai';
import {
  generateRandomEthereumAddress,
  serverUrl,
} from '../../../test/testUtils';
import { createNewUserAddressIfNotExists } from '../../repositories/userAddressRepository';
import Axios from 'axios';
import jwt from 'jsonwebtoken';
import { NotificationSetting } from '../../entities/notificationSetting';

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
    const result = await Axios.get(
      `${apiBaseUrl}/v1/notification_settings?limit=10&category=general`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      },
    );
    const notifications = result.data.notificationSettings;
    assert.isOk(notifications);
    assert.isTrue(notifications[0]?.userAddressId === userAddress.id);
    assert.isTrue(notifications[0]?.notificationType?.category === 'general');
  });
}

function updateNotificationsTestCases() {
  it('should update notification setting', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationSetting = await NotificationSetting.createQueryBuilder(
      'notificationSetting',
    )
      .where('notificationSetting.userAddressId = :id', { id: userAddress.id })
      .getOne();
    const jwtToken = jwt.sign({ publicAddress: walletAddress }, 'xxxx');
    const result = await Axios.put(
      `${apiBaseUrl}/v1/notification_settings/${notificationSetting!.id}`,
      {
        id: notificationSetting!.id,
        allowEmailNotification: false,
        allowDappPushNotification: false,
      },
      { headers: { Authorization: `Bearer ${jwtToken}` } },
    );

    const updatedNotification = result.data;
    assert.isOk(result);
    // didnt update this value so it remains true
    assert.isTrue(updatedNotification.allowNotifications === true);
    assert.isTrue(
      updatedNotification.allowNotifications ===
        notificationSetting?.allowNotifications,
    );
    assert.isTrue(updatedNotification.allowEmailNotification === false);
    assert.isTrue(
      updatedNotification.allowEmailNotification !==
        notificationSetting?.allowEmailNotification,
    );
    assert.isTrue(updatedNotification.allowDappPushNotification === false);
    assert.isTrue(
      updatedNotification.allowDappPushNotification !==
        notificationSetting?.allowDappPushNotification,
    );
  });
}

function updateMultipleNotificationsTestCases() {
  it('should update notification settings', async () => {
    const userAddress = await createNewUserAddressIfNotExists(walletAddress2);
    const notificationSettings = await NotificationSetting.createQueryBuilder(
      'notificationSetting',
    )
      .where('notificationSetting.userAddressId = :id', { id: userAddress.id })
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
    assert.isTrue(updatedNotifications[0].allowNotifications === true);
    assert.isTrue(updatedNotifications[1].allowNotifications === true);

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
    assert.isTrue(updatedNotification1.allowEmailNotification === false);
    assert.isTrue(
      updatedNotification1.allowEmailNotification !==
        notificationSettings[0]?.allowEmailNotification,
    );
    assert.isTrue(updatedNotification1.allowDappPushNotification === false);
    assert.isTrue(
      updatedNotification1.allowDappPushNotification !==
        notificationSettings[0]?.allowDappPushNotification,
    );

    // notification 2
    assert.isTrue(
      updatedNotification2.allowNotifications ===
        notificationSettings[1]?.allowNotifications,
    );
    assert.isTrue(updatedNotification2.allowEmailNotification === false);
    assert.isTrue(
      updatedNotification2.allowEmailNotification !==
        notificationSettings[1]?.allowEmailNotification,
    );
    assert.isTrue(updatedNotification2.allowDappPushNotification === false);
    assert.isTrue(
      updatedNotification2.allowDappPushNotification !==
        notificationSettings[1]?.allowDappPushNotification,
    );
  });
}
