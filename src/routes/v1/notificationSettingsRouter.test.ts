import axios from 'axios';
import { SEED_DATA, serverUrl } from '../../../test/testUtils';
import { assert } from 'chai';
import { createBasicAuthentication } from '../../utils/authorizationUtils';
import { SendNotificationRequest } from '../../types/requestResponses';
import { x } from 'joi';

describe('/notification_settings GET test cases', getNotificationSettingsTestCases);
describe('/notification_settings PUT test cases', updateNotificationsTestCases);

function getNotificationSettingsTestCases() {
  it('should return success response', async () => {
    // const data : SendNotificationRequest ={
    //   email: 'x@giveth.io',
    //   metadata: {},
    //   notificationTemplate:'projectListed',
    //
    //
    // }
    // const result = await axios.post(
    //   `${serverUrl}/v1/notifications`,
    //   {
    //     scopes: [scopeLabels.CREATE_DONATION],
    //   },
    //   {
    //     headers: {
    //       authorization: createBasicAuthentication({
    //         username: applicationData.label,
    //         secret: applicationData.secret,
    //       }),
    //     },
    //   },
    // );
    // assert.equal(result.status, 200);
    // assert.isOk(result.data.result.accessToken);
    // assert.equal(result.data.result.payload.applicationId, applicationData.id);
  });
}

function updateNotificationsTestCases() {
  it('should update notification setting', async () => {

  });
};
