import {
  generateRandomEthereumAddress,
  generateRandomTxHash,
  getAccessTokenForMockAuthMicroService,
  getGivEconomyBasicAuth,
  getGivethIoBasicAuth,
  serverUrl,
  sleep,
} from '../../../test/testUtils';
import axios from 'axios';
import { assert } from 'chai';
import { errorMessages, errorMessagesEnum } from '../../utils/errorMessages';
import { findNotificationByTrackId } from '../../repositories/notificationRepository';

describe('/notifications POST test cases', sendNotificationTestCases);
describe('/notifications GET test cases', getNotificationTestCases);

const sendNotificationUrl = `${serverUrl}/v1/thirdParty/notifications`;
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
        analyticsUserId: 'givethId-255',
        anonymousId: 'givethId-255',
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
      eventName: 'Project unlisted',
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
        eventName: 'Project unlisted',
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

  it('should create *Project unlisted - Donors* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project unlisted - Donors',
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
  it('should create *Project unlisted - Donors* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project unlisted - Donors',
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

  it('should create *Project unlisted - Users Who Liked* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project unlisted - Users Who Liked',
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
  it('should create *Project unlisted - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project unlisted - Users Who Liked',
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
      eventName: 'Project cancelled',
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
        eventName: 'Project cancelled',
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

  it('should create *Project cancelled - Donors* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project cancelled - Donors',
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
  it('should create *Project cancelled - Donors* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project cancelled - Donors',
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

  it('should create *Project cancelled - Users Who Liked* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project cancelled - Users Who Liked',
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
  it('should create *Project cancelled - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project cancelled - Users Who Liked',
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
      eventName: 'Project activated',
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
        eventName: 'Project activated',
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

  it('should create *Project activated - Donors* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project activated - Donors',
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
  it('should create *Project activated - Donors* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project activated - Donors',
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

  it('should create *Project activated - Users Who Liked* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project activated - Users Who Liked',
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
  it('should create *Project activated - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project activated - Users Who Liked',
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
      eventName: 'Project deactivated',
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
        eventName: 'Project deactivated',
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

  it('should create *Project deactivated - Donors* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project deactivated - Donors',
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
  it('should create *Project deactivated - Donors* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project deactivated - Donors',
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

  it('should create *Project deactivated - Users Who Liked* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project deactivated - Users Who Liked',
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
  it('should create *Project deactivated - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project deactivated - Users Who Liked',
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
      eventName: 'Project verified',
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
        eventName: 'Project verified',
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

  it('should create *Project verified - Donors* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project verified - Donors',
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
  it('should create *Project verified - Donors* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project verified - Donors',
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

  it('should create *Project verified - Users Who Liked* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project verified - Users Who Liked',
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
  it('should create *Project verified - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project verified - Users Who Liked',
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

  it('should create *Claim* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Claim',
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

  it('should create *Rewards harvested* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Rewards harvested',
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

  it('should create *Stake* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Stake',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        poolName: 'GIV farm',
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
  it('should create *Stake* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Stake',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          poolName: 'GIV farm',
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

  it('should create *Unlock* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'givPower unlocked',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        poolName: 'GIVpower',
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
          round: 11
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


  it('should create *UnStake* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'UnStake',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        poolName: 'GIV farm',
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
  it('should create *UnStake* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'UnStake',
        sendEmail: false,
        sendSegment: false,
        userWalletAddress: generateRandomEthereumAddress(),
        metadata: {
          poolName: 'GIV farm',
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

  it('should create *GIVbacks are ready to claim* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'GIVbacks are ready to claim',
      sendEmail: false,
      sendSegment: false,
      userWalletAddress: generateRandomEthereumAddress(),
      metadata: {
        round: 5,
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
  it('should create *GIVbacks are ready to claim* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'GIVbacks are ready to claim',
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
      assert.equal(e.response.data.description, '"round" is required');
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
      eventName: 'Project unverified',
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
        eventName: 'Project unverified',
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
        analyticsUserId: 'givethId-255',
        anonymousId: 'givethId-255',
        payload: {
          email: 'test@giveth.com',
          title: 'How many photos is too many photos?',
          firstName: 'firstName',
          projectOwnerId: '68',
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

  it('should create *Project update - Donors* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project update - Donors',
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
  it('should create *Project update - Donors* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project update - Donors',
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

  it('should create *Project update - Donors* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project update - Donors',
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
  it('should create *Project update - Donors* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project update - Donors',
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

  it('should create *Project update - Users Who Liked* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project update - Users Who Liked',
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
  it('should create *Project update - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project update - Users Who Liked',
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

  it('should create *Project updated - owner* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project updated - owner',
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
  it('should create *Project updated - owner* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project updated - owner',
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

  it('should create *Project updated - donor* notification,  success, segment is off', async () => {
    const data = {
      eventName: 'Project updated - donor',
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
  it('should create *Project updated - donor* notification,  failed invalid metadata, segment is off', async () => {
    try {
      const data = {
        eventName: 'Project updated - donor',
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
}
