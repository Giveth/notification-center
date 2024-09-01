import axios from 'axios';
import { assert } from 'chai';
import {
  generateRandomEthereumAddress,
  generateRandomSolanaAddress,
  generateRandomTxHash,
  getAccessTokenForMockAuthMicroService,
  getGivEconomyBasicAuth,
  getGivethIoBasicAuth,
  getNotifyRewardBasicAuth,
  getQaccBasicAuth,
  serverUrl,
  sleep,
} from '../../../test/testUtils';
import { errorMessages, errorMessagesEnum } from '../../utils/errorMessages';
import { findNotificationByTrackId } from '../../repositories/notificationRepository';
import { generateRandomString } from '../../utils/utils';
import { NOTIFICATION_TYPE_NAMES } from '../../types/general';

describe('/notifications POST test cases', sendNotificationTestCases);
describe('/notificationsBulk POST test cases', sendBulkNotificationsTestCases);
describe('/notifications GET test cases', getNotificationTestCases);

const sendNotificationUrl = `${serverUrl}/v1/thirdParty/notifications`;
const sendBulkNotificationsUrl = `${serverUrl}/v1/thirdParty/notificationsBulk`;
const getNotificationUrl = `${serverUrl}/v1/notifications`;
const projectTitle = 'project title';
const projectLink = 'https://giveth.io/project/project-title';

function getNotificationTestCases() {
  it('should create *The profile has been completed* notification,  success, segment is off', async () => {
    const walletAddress = generateRandomEthereumAddress();
    const data = {
      eventName: 'The profile has been completed',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: walletAddress,
      metadata: {},
    };

    await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    await sleep(20);

    await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    await sleep(20);

    await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    await sleep(20);
    const notificationResult = await axios.get(getNotificationUrl, {
      headers: {
        authorization: getAccessTokenForMockAuthMicroService(walletAddress),
      },
    });
    assert.equal(notificationResult.status, 200);
    assert.isOk(notificationResult.data);
    assert.equal(notificationResult.data.count, 3);
    assert.isTrue(
      notificationResult.data.notifications[0].createdAt >
        notificationResult.data.notifications[1].createdAt,
    );
    assert.isTrue(
      notificationResult.data.notifications[1].createdAt >
        notificationResult.data.notifications[2].createdAt,
    );
  });
}

function sendNotificationTestCases() {
  it('should create a notification with a solana wallet address user', async () => {
    const data = {
      eventName: 'Incomplete profile',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomSolanaAddress(),
      metadata: {},
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isTrue(result.data.success);
  });
  it('should create *Incomplete profile* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Incomplete profile',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {},
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });

  it('should create *The profile has been completed* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'The profile has been completed',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {},
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });

  it('should create *Admin message* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Admin message',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        href: 'href',
        linkTitle: 'linkTitle',
        instruction: 'instruction',
        content: 'content',
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Admin message* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Admin message',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          href: 'href',
          instruction: 'instruction',
          content: 'content',
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"linkTitle" is required');
    }
  });

  it('should create *Raw HTML Broadcast* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Raw HTML Broadcast',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        html: '<p>dasl;dksa;lkd;laskd;askd;alsdas <strong>hi</strong></p>',
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Raw HTML Broadcast* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Raw HTML Broadcast',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {},
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"html" is required');
    }
  });

  it('should create *draft project saved* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'The project saved as draft',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *draft project saved* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'The project saved as draft',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Draft published* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Draft published',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Draft published* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Draft published',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project listed* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project listed',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project listed* notification,  success, segment is on', async () => {
    const data = {
      eventName: 'Project listed',
      sendEmail: true,
      sendSegment: true,
      segment: {
        payload: {
          title: 'Test verify and reject form emails',
          lastName: 'Ranjbar',
          firstName: 'Mohammad',
          OwnerId: 255,
          slug: 'test-verify-and-reject-form-emails',
        },
      },
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project listed* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project listed',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project unlisted* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_OWNER,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project unlisted* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_OWNER,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });
  it('should create *Project unlisted - Users who supported* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_SUPPORTED,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project unlisted - Users who supported* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_SUPPORTED,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project listed - Users who supported* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_SUPPORTED,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project listed - Users who supported* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_SUPPORTED,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project cancelled* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_OWNER,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project cancelled* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_OWNER,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });
  it('should create *Project cancelled - Users who supported* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_SUPPORTED,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project cancelled - Users who supported* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_SUPPORTED,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project activated* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_OWNER,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project activated* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_OWNER,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project activated - Users who supported* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_SUPPORTED,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project activated - Users who supported* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_SUPPORTED,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project deactivated* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_OWNER,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
        reason: 'hi',
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project deactivated* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_OWNER,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project deactivated - Users who supported* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_SUPPORTED,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
        reason: 'hi',
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project deactivated - Users who supported* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_SUPPORTED,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project verified* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_OWNER,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project verified* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_OWNER,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project verified - Users who supported* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_SUPPORTED,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project verified - Users who supported* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_SUPPORTED,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Form sent (Under review)* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Form sent (Under review)',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Form sent (Under review)* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Form sent (Under review)',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Form rejected* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Form rejected',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
        reason: 'hi',
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Form rejected* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Form rejected',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Re-apply for verification reminder* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Re-apply for verification reminder',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
        href: 'href',
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Re-apply for verification reminder* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Re-apply for verification reminder',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
          href: 'href',
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Unlock* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'givPower unlocked',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        contractName: 'GIVpower',
        amount: '10',
        round: 13,
        transactionHash: generateRandomTxHash(),
        network: 100,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivEconomyBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Unlock* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'givPower unlocked',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          round: 11,
          contractName: 'GIVpower',
          transactionHash: generateRandomTxHash(),
          network: 100,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivEconomyBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"amount" is required');
    }
  });

  it('should create *GIVbacks are ready to claim* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'GIVback is ready to claim',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        contractName: 'Gnosis Chain Token Distro',
        amount: '10',
        network: 100,
        transactionHash: generateRandomTxHash(),
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivEconomyBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *GIVbacks are ready to claim* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'GIVback is ready to claim',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          contractName: 'Gnosis Chain Token Distro',
          network: 100,
          transactionHash: generateRandomTxHash(),
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivEconomyBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"amount" is required');
    }
  });

  it('should create *Project edited* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project edited',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project edited* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project edited',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project badge revoked* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project badge revoked',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project badge revoked* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project badge revoked',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project unverified* notification,  success, segment is off', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_OWNER,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project unverified* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_OWNER,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Made donation* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Made donation',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Made donation* notification,  success, segment is on', async () => {
    const data = {
      eventName: 'Made donation',
      sendEmail: true,
      sendSegment: true,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
      segment: {
        payload: {
          email: 'test@giveth.com',
          title: 'How many photos is too many photos?',
          firstName: 'firstName',
          slug: 'how-many-photos-is-too-many-photos',
          amount: 0.0001,
          transactionId: generateRandomTxHash(),
          transactionNetworkId: 5,
          currency: 'ETH',
          createdAt: '2022-11-10T07:36:13.182Z',
          toWalletAddress: generateRandomEthereumAddress(),
          donationValueUsd: 0.120492,
          donationValueEth: 0.0001,
          verified: true,
          transakStatus: null,
          fromWalletAddress: generateRandomEthereumAddress(),
        },
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Made donation* notification,  success, segment is on, donationValueEth is null', async () => {
    const data = {
      eventName: 'Made donation',
      sendEmail: true,
      sendSegment: true,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
      segment: {
        payload: {
          email: 'test@giveth.com',
          title: 'How many photos is too many photos?',
          firstName: 'firstName',
          slug: 'how-many-photos-is-too-many-photos',
          amount: 0.0001,
          transactionId: generateRandomTxHash(),
          transactionNetworkId: 5,
          currency: 'ETH',
          createdAt: '2022-11-10T07:36:13.182Z',
          toWalletAddress: generateRandomEthereumAddress(),
          donationValueUsd: 0.120492,
          donationValueEth: null,
          verified: true,
          transakStatus: null,
          fromWalletAddress: generateRandomEthereumAddress(),
        },
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Made donation* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Made donation',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Donation received* notification,  success, segment is on', async () => {
    const data = {
      eventName: 'Donation received',
      sendEmail: true,
      sendSegment: true,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
      segment: {
        payload: {
          email: 'test@giveth.com',
          title: 'How many photos is too many photos?',
          firstName: 'firstName',
          slug: 'how-many-photos-is-too-many-photos',
          amount: 0.0001,
          transactionId: generateRandomTxHash(),
          transactionNetworkId: 5,
          currency: 'ETH',
          createdAt: '2022-11-10T07:36:13.182Z',
          toWalletAddress: generateRandomEthereumAddress(),
          donationValueUsd: 0.120492,
          donationValueEth: 0.0001,
          verified: true,
          transakStatus: null,
          fromWalletAddress: generateRandomEthereumAddress(),
        },
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Donation received* notification,  success, segment is on, donationValueEth is null', async () => {
    const data = {
      eventName: 'Donation received',
      sendEmail: true,
      sendSegment: true,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
      segment: {
        payload: {
          email: 'test@giveth.com',
          title: 'How many photos is too many photos?',
          firstName: 'firstName',
          slug: 'how-many-photos-is-too-many-photos',
          amount: 0.0001,
          transactionId: generateRandomTxHash(),
          transactionNetworkId: 5,
          currency: 'ETH',
          createdAt: '2022-11-10T07:36:13.182Z',
          toWalletAddress: generateRandomEthereumAddress(),
          donationValueUsd: 0.120492,
          donationValueEth: null,
          verified: true,
          transakStatus: null,
          fromWalletAddress: generateRandomEthereumAddress(),
        },
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Donation received* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Donation received',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Donation received* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Donation received',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Failed donation* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Donation get price failed',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
        reason: 'reason',
        txLink: 'txLink',
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Failed donation* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Donation get price failed',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
          reason: 'reason',
          txLink: 'txLink',
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project update* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project update',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project update* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project update',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project update added - Users who supported* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project update added - Users who supported',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project update added - Users who supported* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project update added - Users who supported',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project update added - owner* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project update added - owner',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project update added - owner* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project update added - owner',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Verification form got draft by admin* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Verification form got draft by admin',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Verification form got draft by admin* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Verification form got draft by admin',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *project liked* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'project liked',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *project liked* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'project liked',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project has new lower rank* notification,  success', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_A_NEW_RANK,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project has new lower rank* notification,  failed invalid metadata', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create *Project has new higher rank* notification,  success', async () => {
    const data = {
      eventName: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Project has new higher rank* notification,  failed invalid metadata', async () => {
    try {
      const data = {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          projectLink,
        },
      };

      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(e.response.data.description, '"projectTitle" is required');
    }
  });

  it('should create notification successfully with passing trackId', async () => {
    const trackId = generateRandomTxHash();
    const data = {
      eventName: 'Draft published',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      trackId,
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
    assert.isNotNull(await findNotificationByTrackId(trackId));
  });

  it('should throw error for repetitive trackId', async () => {
    const trackId = generateRandomTxHash();
    const data = {
      eventName: 'Draft published',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      trackId,
      metadata: {
        projectTitle,
        projectLink,
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });

    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
    assert.isNotNull(await findNotificationByTrackId(trackId));
    const duplicateResult = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(duplicateResult.status, 200);
    assert.equal(
      duplicateResult.data.message,
      errorMessages.DUPLICATED_TRACK_ID,
    );
  });

  it('should create notification successfully with passing creationTime', async () => {
    const creationTime = new Date().getTime();
    const trackId = generateRandomTxHash();
    const data = {
      eventName: 'Draft published',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      trackId,
      creationTime,
      metadata: {
        projectTitle,
        projectLink,
      },
    };
    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
    const createdNotification = await findNotificationByTrackId(trackId);
    assert.equal(createdNotification?.createdAt.getTime(), creationTime);
  });

  it('should create *Notify reward amount* notification,  success', async () => {
    const data = {
      eventName: 'Notify reward amount',
      sendEmail: true,
      sendSegment: true,
      creationTime: 1667992708000,
      segment: {
        payload: {
          round: 10,
          date: '1667992708000',
          amount: '12134',
          contractAddress: '0xsfglsjfdflk',
          farm: 'test farm',
          message: 'test message',
          network: 'ethereum',
          script: 'test script',
          transactionHash: 'test txhash',
          email: 'aliebrahimi2079@gmail.com',
        },
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getNotifyRewardBasicAuth(),
      },
    });

    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Notify reward amount* notification, failed invalid payload', async () => {
    try {
      const data = {
        eventName: 'Notify reward amount',
        sendEmail: true,
        sendSegment: true,
        creationTime: 1667992708000,
        segment: {
          payload: {
            round: 10,
            date: '1667992708000',
            amount: '12134',
            contractAddress: '0xsfglsjfdflk',
            farm: 'test farm',
            message: 'test message',
            network: 'ethereum',
            script: 'test script',
            transactionHash: 'test txhash',
            email: 'aliebrahimi2079@gmail.com',
            invalidField: 'invalid data',
          },
        },
      };
      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getNotifyRewardBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(
        e.response.data.description,
        '"segment.payload.invalidField" is not allowed',
      );
    }
  });

  it('should create *Send email verification code for Qacc* notification,  success', async () => {
    const data = {
      eventName: 'Send email verification code for Qacc',
      segment: {
        payload: {
          verificationCode: 654321,
          email: 'aliebrahimi2079@gmail.com',
        },
      },
    };

    const result = await axios.post(sendNotificationUrl, data, {
      headers: {
        authorization: getQaccBasicAuth(),
      },
    });

    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
  });
  it('should create *Send email verification code for Qacc* notification, failed invalid payload', async () => {
    try {
      const data = {
        eventName: 'Send email verification code for Qacc',
        segment: {
          payload: {
            verificationCode: 654321,
            email: 'aliebrahimi2079@gmail.com',
            invalidField: 'invalid data',
          },
        },
      };
      await axios.post(sendNotificationUrl, data, {
        headers: {
          authorization: getQaccBasicAuth(),
        },
      });
      // If request doesn't fail, it means this test failed
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(
        e.response.data.description,
        '"segment.payload.invalidField" is not allowed',
      );
    }
  });
}

function sendBulkNotificationsTestCases() {
  it('should create two *project liked* notifications,  success, segment is off', async () => {
    const data = {
      notifications: [
        {
          eventName: 'project liked',
          sendEmail: false,
          sendSegment: false,
          userWalletAddress: generateRandomEthereumAddress(),
          trackId: `${new Date().getTime()}-${generateRandomString(30)}`,
          metadata: {
            projectTitle,
            projectLink,
          },
        },
        {
          eventName: 'project liked',
          sendEmail: false,
          sendSegment: false,
          userWalletAddress: generateRandomEthereumAddress(),
          trackId: `${new Date().getTime()}-${generateRandomString(30)}`,
          metadata: {
            projectTitle,
            projectLink,
          },
        },
      ],
    };
    const result = await axios.post(sendBulkNotificationsUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
    assert.isOk(
      await findNotificationByTrackId(data.notifications[0].trackId as string),
    );
    assert.isOk(
      await findNotificationByTrackId(data.notifications[1].trackId as string),
    );
  });
  it('should create two *project liked* notifications, success 100 notification', async () => {
    const notifications = [];
    for (let i = 0; i < 100; i++) {
      notifications.push({
        eventName: 'project liked',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        trackId: `${new Date().getTime()}-${generateRandomString(30)}`,
        metadata: {
          projectTitle,
          projectLink,
        },
      });
    }
    const data = {
      notifications,
    };
    const result = await axios.post(sendBulkNotificationsUrl, data, {
      headers: {
        authorization: getGivethIoBasicAuth(),
      },
    });
    assert.equal(result.status, 200);
    assert.isOk(result.data);
    assert.isTrue(result.data.success);
    for (const notification of data.notifications) {
      assert.isOk(
        await findNotificationByTrackId(notification.trackId as string),
      );
    }
  });
  it('should create two *project liked* notifications, failed for more than 100', async () => {
    const notifications = [];
    for (let i = 0; i < 101; i++) {
      notifications.push({
        eventName: 'project liked',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        trackId: `${new Date().getTime()}-${generateRandomString(30)}`,
        metadata: {
          projectTitle,
          projectLink,
        },
      });
    }
    const data = {
      notifications,
    };
    try {
      await axios.post(sendBulkNotificationsUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(
        e.response.data.description,
        '"notifications" must contain less than or equal to 100 items',
      );
    }
  });
  it('should create two *project liked* notifications, failed because two notifications have same trackIds', async () => {
    const trackId = `${new Date().getTime()}-${generateRandomString(30)}`;
    const notifications = [
      {
        eventName: 'project liked',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        trackId,
        metadata: {
          projectTitle,
          projectLink,
        },
      },
      {
        eventName: 'project liked',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        trackId,
        metadata: {
          projectTitle,
          projectLink,
        },
      },
    ];
    try {
      await axios.post(
        sendBulkNotificationsUrl,
        { notifications },
        {
          headers: {
            authorization: getGivethIoBasicAuth(),
          },
        },
      );
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessages.THERE_IS_SOME_ITEMS_WITH_SAME_TRACK_ID,
      );
    }
  });
  it('should create two *project liked* notifications, failed for empty array', async () => {
    const data = {
      notifications: [],
    };
    try {
      await axios.post(sendBulkNotificationsUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message,
      );
      assert.equal(
        e.response.data.description,
        '"notifications" must contain at least 1 items',
      );
    }
  });
  it('should create two *project liked* notifications, failed if one notification had problem', async () => {
    const data = {
      notifications: [
        {
          eventName: 'project liked',
          sendEmail: false,
          sendSegment: false,
          userWalletAddress: generateRandomEthereumAddress(),
          trackId: `${new Date().getTime()}-${generateRandomString(30)}`,
          metadata: {
            projectTitle,
            projectLink,
          },
        },
        {
          eventName: 'project liked2',
          trackId: `${new Date().getTime()}-${generateRandomString(30)}`,
          sendEmail: false,
          sendSegment: false,
          userWalletAddress: generateRandomEthereumAddress(),
          metadata: {
            projectTitle,
            projectLink,
          },
        },
      ],
    };
    try {
      await axios.post(sendBulkNotificationsUrl, data, {
        headers: {
          authorization: getGivethIoBasicAuth(),
        },
      });
      assert.isTrue(false);
    } catch (e: any) {
      assert.equal(
        e.response.data.message,
        errorMessages.INVALID_NOTIFICATION_TYPE,
      );
    }
  });
}
