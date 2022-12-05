import { assert } from 'chai';
import {
  generateRandomEthereumAddress,
  saveUserAddressDirectlyToDb,
  sleep,
} from '../../test/testUtils';
import { NotificationSetting } from '../entities/notificationSetting';
import { MICRO_SERVICES } from '../utils/utils';
import {
  createNewUserAddress,
  createNewUserAddressIfNotExists,
  findUserByWalletAddress,
} from './userAddressRepository';

describe(
  'findUserByWalletAddress test cases',
  findUserByWalletAddressTestCases,
);

describe('createNewUserAddress test cases', createNewUserAddressTestCases);

describe(
  'createNewUserAddressIfNotExists() test cases',
  createNewUserAddressIfNotExistsTestCases,
);

function findUserByWalletAddressTestCases() {
  it('should return user address entity even if uppercased', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const userAddress = await saveUserAddressDirectlyToDb({ walletAddress });

    const upperCaseResult = await findUserByWalletAddress(
      walletAddress.toUpperCase(),
    );
    const lowerCaseResult = await findUserByWalletAddress(
      walletAddress.toLowerCase(),
    );

    assert.equal(userAddress.id, upperCaseResult!.id);
    assert.equal(userAddress.id, lowerCaseResult!.id);
  });
}

// this not only creates the address but also the notification settings
function createNewUserAddressTestCases() {
  it('should create the userAddress with all preexisting settings', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const user = await createNewUserAddress(walletAddress);

    const givethNotificationSettings =
      await NotificationSetting.createQueryBuilder('setting')
        .leftJoinAndSelect('setting.notificationType', 'notificationType')
        .where('setting."userAddressId" = :userAddressId', {
          userAddressId: user.id,
        })
        .getMany();

    assert.isOk(user);
    assert.isTrue(givethNotificationSettings.length > 0);
    givethNotificationSettings.forEach(setting => {
      assert.equal(setting!.userAddressId, user.id);
    });
  });
}

function createNewUserAddressIfNotExistsTestCases() {
  it('should return same user if it does not exist', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const user = await createNewUserAddress(walletAddress);
    const sameUser = await createNewUserAddressIfNotExists(walletAddress);

    assert.equal(user!.id, sameUser!.id);
  });
}
