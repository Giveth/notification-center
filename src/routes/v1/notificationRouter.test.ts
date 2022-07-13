import axios from 'axios';
import { SEED_DATA, serverUrl } from '../../../test/testUtils';
import { assert } from 'chai';
import { createBasicAuthentication } from '../../utils/authorizationUtils';
import {SendNotificationRequest} from "../../types/requestResponses";
import {x} from "joi";

describe('/notifications POST test cases', sendNotification);

function sendNotification() {
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
