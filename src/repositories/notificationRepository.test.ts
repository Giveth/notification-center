import { assert } from 'chai';
import {
  generateRandomEthereumAddress,
  saveNotificationDirectlyToDb,
} from '../../test/testUtils';
import { NotificationSetting } from '../entities/notificationSetting';
import { NotificationType } from '../entities/notificationType';
import {
  countUnreadNotifications,
  getNotifications,
  markNotificationsAsRead,
} from './notificationRepository';
import {
  getUserNotificationSettings,
  updateUserNotificationSetting,
} from './notificationSettingRepository';
import { createNewUserAddressIfNotExists } from './userAddressRepository';

// createNotificationSettingsForNewUser tested in userRepository
describe('getNotifications() test cases', getNotificationsTestCases);

describe(
  'markNotificationsAsRead() test cases',
  markNotificationsAsReadTestCases,
);

describe(
  'countUnreadNotifications() test cases',
  countUnreadNotificationsTestCases,
);

const eventName = 'Project listed';
const profileEventName = 'Updated profile';

function countUnreadNotificationsTestCases() {
  it('should count unread notifications by category', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationType = await NotificationType.createQueryBuilder('type')
      .where('type.name = :name', { name: eventName })
      .getOne();
    const profileNotificationType = await NotificationType.createQueryBuilder('type')
      .where('type.name = :name', { name: profileEventName })
      .getOne();
    const notification = await saveNotificationDirectlyToDb(
      userAddress,
      notificationType!,
    );
    const notification2 = await saveNotificationDirectlyToDb(
      userAddress,
      profileNotificationType!,
    );

    const notificationCount = await countUnreadNotifications(userAddress);

    assert.isOk(notificationCount);
    assert.equal(notificationCount.total, 2);
    assert.equal(notificationCount.projectsRelated, 1);
    assert.equal(notificationCount.general, 1);
  });
}

function getNotificationsTestCases() {
  it('return notification settings by user and take and skip', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationType = await NotificationType.createQueryBuilder('type')
      .where('type.name = :name', { name: eventName })
      .getOne();
    const notification = await saveNotificationDirectlyToDb(
      userAddress,
      notificationType!,
    );
    const take = 2;
    const skip = 0;

    const [notifications] = await getNotifications({
      userAddressId: userAddress.id,
      limit: take,
      skip: skip,
    });

    assert.isOk(notifications);
    assert.isTrue(notifications!.length > 0);
    notifications.forEach(notification => {
      assert.isTrue(notification!.userAddressId === userAddress.id);
    });
  });
}

function markNotificationsAsReadTestCases() {
  it('should mark user notification as read', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationType = await NotificationType.createQueryBuilder('type')
      .where('type.name = :name', { name: eventName })
      .getOne();
    const notification = await saveNotificationDirectlyToDb(
      userAddress,
      notificationType!,
    );

    const updatedNotification = await markNotificationsAsRead({
      notificationId: notification.id,
      userAddressId: userAddress.id,
    });
    assert.equal(notification!.isRead, false);
    assert.equal(updatedNotification!.isRead, true);
  });
}
