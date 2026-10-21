import { assert } from 'chai';
import { Notification } from '../entities/notification';
import { NotificationSetting } from '../entities/notificationSetting';
import { NotificationType } from '../entities/notificationType';
import { UserAddress } from '../entities/userAddress';
import { MICRO_SERVICES } from '../utils/utils';
import { generateRandomEthereumAddress } from '../../test/testUtils';
import { createNewUserAddress } from './userAddressRepository';
import { purgeErasedUserData } from './userErasureRepository';

describe('purgeErasedUserData() test cases', purgeErasedUserDataTestCases);

const typeOf = async (microService: string): Promise<NotificationType> => {
  const type = await NotificationType.findOne({ where: { microService } });
  assert.isOk(type, `no seeded notification type for ${microService}`);
  return type as NotificationType;
};

const notify = (fields: Partial<Notification>): Promise<Notification> =>
  Notification.create({
    segmentData: {},
    metadata: {},
    ...fields,
  } as Notification).save();

const settingsCount = (userAddress: UserAddress) =>
  NotificationSetting.count({
    where: { userAddress: { id: userAddress.id } },
  });

function purgeErasedUserDataTestCases() {
  it('deletes the caller’s notifications and settings for the wallets, then the orphaned address', async () => {
    const wallet = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddress(wallet);
    const givethType = await typeOf(MICRO_SERVICES.givethio);
    const notification = await notify({
      userAddress,
      notificationType: givethType,
    });
    const givethSettings = await NotificationSetting.count({
      where: {
        userAddress: { id: userAddress.id },
        notificationType: { microService: MICRO_SERVICES.givethio },
      },
    });
    const otherSettings = (await settingsCount(userAddress)) - givethSettings;
    assert.isAbove(givethSettings, 0);
    // Settings of other products' types keep the address alive; remove
    // them so this case sees the address become orphaned.
    if (otherSettings > 0) {
      await NotificationSetting.createQueryBuilder()
        .delete()
        .where('"userAddressId" = :id', { id: userAddress.id })
        .andWhere(
          '"notificationTypeId" IN (SELECT id FROM notification_type WHERE "microService" <> :ms)',
          { ms: MICRO_SERVICES.givethio },
        )
        .execute();
    }

    const result = await purgeErasedUserData({
      // Any case: addresses are matched lowercased.
      walletAddresses: [wallet.toUpperCase().replace('0X', '0x')],
      emails: [],
      microService: MICRO_SERVICES.givethio,
    });

    assert.equal(result.notifications, 1);
    assert.equal(result.notificationSettings, givethSettings);
    assert.equal(result.userAddresses, 1);
    assert.isNull(
      await Notification.findOne({ where: { id: notification.id } }),
    );
    assert.isNull(await UserAddress.findOne({ where: { id: userAddress.id } }));
  });

  it('deletes notifications sent to one of the emails, by row email or segment payload, ignoring case', async () => {
    const givethType = await typeOf(MICRO_SERVICES.givethio);
    // Sent to the person's email but filed under a wallet the purge does not
    // name (every notification row has one).
    const userAddress = await createNewUserAddress(
      generateRandomEthereumAddress(),
    );
    const email = `erased-${Date.now()}@example.com`;
    const byEmail = await notify({
      userAddress,
      notificationType: givethType,
      email: email.toUpperCase(),
    });
    const bySegment = await notify({
      userAddress,
      notificationType: givethType,
      segmentData: { payload: { email, userId: 7 } },
    });
    const unrelated = await notify({
      userAddress,
      notificationType: givethType,
      email: `someone-else-${Date.now()}@example.com`,
    });

    const result = await purgeErasedUserData({
      walletAddresses: [],
      emails: [email],
      microService: MICRO_SERVICES.givethio,
    });

    assert.equal(result.notifications, 2);
    assert.isNull(await Notification.findOne({ where: { id: byEmail.id } }));
    assert.isNull(await Notification.findOne({ where: { id: bySegment.id } }));
    assert.isOk(await Notification.findOne({ where: { id: unrelated.id } }));
    await unrelated.remove();
  });

  it('leaves another micro-service’s notifications, settings and the shared address alone', async () => {
    const wallet = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddress(wallet);
    const givethType = await typeOf(MICRO_SERVICES.givethio);
    const otherType = await typeOf(
      MICRO_SERVICES.givEconomyNotificationMicroService,
    );
    await notify({ userAddress, notificationType: givethType });
    const otherNotification = await notify({
      userAddress,
      notificationType: otherType,
    });

    const result = await purgeErasedUserData({
      walletAddresses: [wallet],
      emails: [],
      microService: MICRO_SERVICES.givethio,
    });

    assert.equal(result.notifications, 1);
    assert.equal(result.userAddresses, 0);
    assert.isOk(
      await Notification.findOne({ where: { id: otherNotification.id } }),
    );
    assert.isOk(await UserAddress.findOne({ where: { id: userAddress.id } }));
    const remainingGivethSettings = await NotificationSetting.count({
      where: {
        userAddress: { id: userAddress.id },
        notificationType: { microService: MICRO_SERVICES.givethio },
      },
    });
    assert.equal(remainingGivethSettings, 0);
    const otherSettings = await NotificationSetting.createQueryBuilder('s')
      .innerJoin('s.notificationType', 't')
      .where('s."userAddressId" = :id', { id: userAddress.id })
      .andWhere('t."microService" <> :ms', { ms: MICRO_SERVICES.givethio })
      .getCount();
    assert.isAbove(otherSettings, 0);
  });

  // Legacy data: an email no validator would accept still matches.
  it('matches a malformed stored email exactly as given', async () => {
    const givethType = await typeOf(MICRO_SERVICES.givethio);
    const userAddress = await createNewUserAddress(
      generateRandomEthereumAddress(),
    );
    const email = `Legacy ${Date.now()}@localhost`;
    const notification = await notify({
      userAddress,
      notificationType: givethType,
      email,
    });

    const result = await purgeErasedUserData({
      walletAddresses: [],
      emails: [email],
      microService: MICRO_SERVICES.givethio,
    });

    assert.equal(result.notifications, 1);
    assert.isNull(
      await Notification.findOne({ where: { id: notification.id } }),
    );
  });

  it('is idempotent: a repeated purge deletes nothing more', async () => {
    const wallet = generateRandomEthereumAddress();
    await createNewUserAddress(wallet);
    const email = `again-${Date.now()}@example.com`;

    await purgeErasedUserData({
      walletAddresses: [wallet],
      emails: [email],
      microService: MICRO_SERVICES.givethio,
    });
    const second = await purgeErasedUserData({
      walletAddresses: [wallet],
      emails: [email],
      microService: MICRO_SERVICES.givethio,
    });

    assert.deepEqual(second, {
      notifications: 0,
      notificationSettings: 0,
      userAddresses: 0,
    });
  });
}
