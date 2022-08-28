import { assert } from "chai";
import { SegmentEvents } from "../services/segment/analytics";
import { MICRO_SERVICES } from "../utils/utils";
import { getNotificationTypeByEventName, getNotificationTypeByEventNameAndMicroservice } from "./notificationTypeRepository";
import { findThirdPartyBySecret } from "./thirdPartyRepository";

describe(
  'getNotificationTypeByEventName() test cases',
  getNotificationTypeByEventNameTestCases,
);

describe(
  'getNotificationTypeByEventNameAndMicroservice() test cases',
  getNotificationTypeByEventNameAndMicroserviceTestCases,
);

function getNotificationTypeByEventNameTestCases () {
  it('should get notification types by event name', async () => {
    const notificationType = await getNotificationTypeByEventName(
      SegmentEvents.PROJECT_LISTED
    );

    assert.isOk(notificationType);
    assert.isTrue(notificationType!.name === SegmentEvents.PROJECT_LISTED);
  });
};

function getNotificationTypeByEventNameAndMicroserviceTestCases () {
  it('should get notification types by event name and microservice', async () => {
    const notificationType = await getNotificationTypeByEventNameAndMicroservice(
      {
        eventName: SegmentEvents.PROJECT_UNLISTED,
        microService: MICRO_SERVICES.givethio,
      }
    );

    assert.isOk(notificationType);
    assert.isTrue(notificationType!.name === SegmentEvents.PROJECT_UNLISTED);
    assert.isTrue(notificationType!.microService === MICRO_SERVICES.givethio);
  });
};