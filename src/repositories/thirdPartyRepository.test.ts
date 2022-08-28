import { assert } from "chai";
import { findThirdPartyBySecret } from "./thirdPartyRepository";

describe(
  'findThirdPartyBySecret() test cases',
  findThirdPartyBySecretTestCases,
);

// Giveth test login
const username = 'givethio';
const secret = 'givethio_secret';

function findThirdPartyBySecretTestCases () {
  it('should return microservice by name and secret', async () => {
    const thirdParty = await findThirdPartyBySecret({
      username,
      secret
    });

    assert.isOk(thirdParty);
    assert.isTrue(thirdParty!.microService === username);
  });

  it('should not return microservice if secret is wrong', async () => {
    const thirdParty = await findThirdPartyBySecret({
      username,
      secret: 'test'
    });

    assert.isNotOk(thirdParty);
  });
}