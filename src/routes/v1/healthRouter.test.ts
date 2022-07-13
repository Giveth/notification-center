import axios from 'axios';
import { serverUrl } from '../../../test/testUtils';
import { assert } from 'chai';
import { MESSAGES } from '../../utils/messages';

describe('/health test cases', healthTestCases);

function healthTestCases() {
  it('should return success response', async () => {
    const result = await axios.get(`${serverUrl}/v1/health`);
    assert.equal(result.status, 200);
    assert.equal(result.data.message, MESSAGES.healthMessageImAlive);
  });
}
