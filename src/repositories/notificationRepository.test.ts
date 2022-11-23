import { assert } from 'chai';
import {
  generateRandomEthereumAddress,
  saveNotificationDirectlyToDb,
  sleep,
} from '../../test/testUtils';
import { NotificationSetting } from '../entities/notificationSetting';
import { NotificationType } from '../entities/notificationType';
import { EMAIL_STATUSES, Notification } from '../entities/notification';
import {
  countUnreadNotifications,
  createNotification,
  getNotifications,
  markNotificationGroupAsRead,
  markNotificationsAsRead,
} from './notificationRepository';
import {
  getUserNotificationSettings,
  updateUserNotificationSetting,
} from './notificationSettingRepository';
import { createNewUserAddressIfNotExists } from './userAddressRepository';
import { NOTIFICATION_CATEGORY } from '../types/general';

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

describe(
  'markNotificationGroupAsRead() test cases',
  markNotificationGroupAsReadTestCases,
);

describe('createNotification() test cases', createNotificationTestCases);

const eventName = 'Project listed';
const profileEventName = 'Incomplete profile';

function createNotificationTestCases() {
  it('should create notification with required params', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationType = await NotificationType.createQueryBuilder('type')
      .where('type.name = :name', { name: eventName })
      .getOne();

    const result = await createNotification({
      notificationType: notificationType!,
      userAddress,
      email: 'test@example.com',
      emailStatus: EMAIL_STATUSES.NO_NEED_TO_SEND,
      projectId: '1',
      metadata: {
        projectTitle: 'Carlos',
        projectLink: 'https://givet.io/Carlos',
      },
    });

    assert.isOk(result);
    assert.equal(result.userAddress.id, userAddress.id);
    assert.equal(result.notificationTypeId, notificationType!.id);
  });
}

function countUnreadNotificationsTestCases() {
  it('should count unread notifications by category', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationType = await NotificationType.createQueryBuilder('type')
      .where('type.name = :name', { name: eventName })
      .getOne();
    const profileNotificationType = await NotificationType.createQueryBuilder(
      'type',
    )
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

function markNotificationGroupAsReadTestCases() {
  it('should mark a group of notifications as read', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddressIfNotExists(walletAddress);
    const notificationType = await NotificationType.createQueryBuilder('type')
      .where('type.name = :name', { name: eventName })
      .getOne();
    const profileNotificationType = await NotificationType.createQueryBuilder(
      'type',
    )
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

    const result = await markNotificationGroupAsRead(
      userAddress,
      NOTIFICATION_CATEGORY.GENERAL,
    );

    const nonUpdatednotification = await Notification.createQueryBuilder()
      .where('id = :id', { id: notification!.id })
      .getOne();
    const updatedNotification = await Notification.createQueryBuilder()
      .where('id = :id', { id: notification2!.id })
      .getOne();

    assert.notEqual(updatedNotification!.isRead, notification2!.isRead);
    assert.equal(nonUpdatednotification!.isRead, notification!.isRead);
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
