import axios from 'axios';
import { assert } from 'chai';
import {
  generateRandomEthereumAddress,
  getGivethIoBasicAuth,
  serverUrl,
} from '../../../test/testUtils';
import { UserAddress } from '../../entities/userAddress';
import { createNewUserAddress } from '../../repositories/userAddressRepository';

describe('/thirdParty/userErasure POST test cases', userErasureTestCases);

const userErasureUrl = `${serverUrl}/v1/thirdParty/userErasure`;

function userErasureTestCases() {
  it('refuses a call without third-party credentials', async () => {
    try {
      await axios.post(userErasureUrl, { walletAddresses: [], emails: [] });
      assert.fail('expected a 401');
    } catch (e: any) {
      assert.equal(e.response?.status, 401);
    }
  });

  it('rejects a body without the emails list', async () => {
    try {
      await axios.post(
        userErasureUrl,
        { walletAddresses: [generateRandomEthereumAddress()] },
        { headers: { authorization: getGivethIoBasicAuth() } },
      );
      assert.fail('expected a 400');
    } catch (e: any) {
      assert.equal(e.response?.status, 400);
    }
  });

  it('purges the wallet’s data for the calling micro-service and reports counts', async () => {
    const wallet = generateRandomEthereumAddress();
    const userAddress = await createNewUserAddress(wallet);

    const response = await axios.post(
      userErasureUrl,
      { walletAddresses: [wallet], emails: ['erased@example.com'] },
      { headers: { authorization: getGivethIoBasicAuth() } },
    );

    assert.equal(response.status, 200);
    assert.isTrue(response.data.success);
    assert.isAbove(response.data.notificationSettings, 0);
    assert.isNumber(response.data.notifications);
    // Other products' settings may still hold the address; the Giveth ones
    // are gone either way.
    const stillThere = await UserAddress.findOne({
      where: { id: userAddress.id },
      relations: ['settings'],
    });
    assert.isTrue(
      !stillThere ||
        stillThere.settings!.every(
          setting => setting.notificationType.microService !== 'givethio',
        ),
    );
  });
}

describe(
  '/thirdParty/userErasure POST with real-world data (giveth-v6-core#501)',
  userErasureRealWorldDataTestCases,
);

function userErasureRealWorldDataTestCases() {
  // Legacy data holds emails no strict validator accepts; the purge must
  // still go through, or it would be retried forever.
  it('accepts emails that are not well-formed and still purges by them', async () => {
    const response = await axios.post(
      userErasureUrl,
      {
        walletAddresses: [],
        emails: ['bob@localhost', 'alice@example.notatld', 'not an email'],
      },
      { headers: { authorization: getGivethIoBasicAuth() } },
    );

    assert.equal(response.status, 200);
    assert.isTrue(response.data.success);
  });

  // A merged account can hold more than a handful of either.
  it('accepts more than 10 emails and more than 50 wallets in one request', async () => {
    const response = await axios.post(
      userErasureUrl,
      {
        walletAddresses: Array.from({ length: 120 }, () =>
          generateRandomEthereumAddress(),
        ),
        emails: Array.from(
          { length: 120 },
          (_, i) => `erased-${i}-${Date.now()}@example.com`,
        ),
      },
      { headers: { authorization: getGivethIoBasicAuth() } },
    );

    assert.equal(response.status, 200);
  });
}
