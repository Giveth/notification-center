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
describe('/notification_settings PUT test cases', updateNotificationsTestCases);

const walletAddress = generateRandomEthereumAddress().toLowerCase();

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
        allowEmailNotification: 'false',
        allowDappPushNotification: 'false',
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
