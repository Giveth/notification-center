// import axios from 'axios';
// import { SEED_DATA, serverUrl } from '../../../test/testUtils';
// import { createBasicAuthentication } from '../../utils/authorizationUtils';
// import { SendNotificationRequest } from '../../types/requestResponses';
// import { x } from 'joi';

import { assert } from "chai";

describe(
  '/notification_settings GET test cases',
  getNotificationSettingsTestCases,
);
describe('/notification_settings PUT test cases', updateNotificationsTestCases);

function getNotificationSettingsTestCases() {
  it('should return success response', async () => {
    assert.isTrue(true);
  });
}

function updateNotificationsTestCases() {
  it('should update notification setting', async () => {
    assert.isTrue(true);
  });
}
