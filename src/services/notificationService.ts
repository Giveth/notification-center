import {
  createNotification,
  findNotificationByTrackId,
} from '../repositories/notificationRepository';
import { errorMessages } from '../utils/errorMessages';
import { createNewUserAddressIfNotExists } from '../repositories/userAddressRepository';
import { getNotificationTypeByEventNameAndMicroservice } from '../repositories/notificationTypeRepository';
import { findNotificationSettingByNotificationTypeAndUserAddress } from '../repositories/notificationSettingRepository';
import { logger } from '../utils/logger';
import { EMAIL_STATUSES, Notification } from '../entities/notification';
import { SEGMENT_METADATA_SCHEMA_VALIDATOR } from '../utils/validators/segmentAndMetadataValidators';
import { validateWithJoiSchema } from '../validators/schemaValidators';
import { SegmentAnalyticsSingleton } from './segment/segmentAnalyticsSingleton';
import { SendNotificationRequest } from '../types/requestResponses';
import { StandardError } from '../types/StandardError';

export const sendNotification = async (
  body: SendNotificationRequest,
  microService: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  const { userWalletAddress, projectId } = body;
  if (body.trackId && (await findNotificationByTrackId(body.trackId))) {
    // We dont throw error in this case but dont create new notification neither
    return {
      success: true,
      message: errorMessages.DUPLICATED_TRACK_ID,
    };
  }
  const userAddress = await createNewUserAddressIfNotExists(
    userWalletAddress as string,
  );
  const notificationType = await getNotificationTypeByEventNameAndMicroservice({
    eventName: body.eventName,
    microService,
  });

  if (!notificationType) {
    throw new StandardError({
      message: errorMessages.INVALID_NOTIFICATION_TYPE,
      httpStatusCode: 400,
    });
  }
  const notificationSetting =
    await findNotificationSettingByNotificationTypeAndUserAddress({
      notificationTypeId: notificationType.id,
      userAddressId: userAddress.id,
    });

  logger.debug('notificationController.sendNotification()', {
    notificationSetting,
    notificationType,
  });

  const shouldSendEmail =
    body.sendEmail && notificationSetting?.allowEmailNotification;
  let emailStatus = shouldSendEmail
    ? EMAIL_STATUSES.WAITING_TO_BE_SEND
    : EMAIL_STATUSES.NO_NEED_TO_SEND;

  const segmentValidator =
    SEGMENT_METADATA_SCHEMA_VALIDATOR[
      notificationType?.schemaValidator as string
    ]?.segment;

  if (shouldSendEmail && body.sendSegment && segmentValidator) {
    //TODO Currently sending email and segment event are tightly coupled, we can't send segment event without sending email
    // And it's not good, we should find another solution to separate sending segment and email
    const segmentData = body.segment?.payload;
    validateWithJoiSchema(segmentData, segmentValidator);
    await SegmentAnalyticsSingleton.getInstance().track({
      eventName: notificationType.emailNotificationId as string,
      anonymousId: body?.segment?.anonymousId,
      properties: segmentData,
      analyticsUserId: body?.segment?.analyticsUserId,
    });
    emailStatus = EMAIL_STATUSES.SENT;
  }

  const metadataValidator =
    SEGMENT_METADATA_SCHEMA_VALIDATOR[
      notificationType?.schemaValidator as string
    ]?.metadata;

  if (metadataValidator) {
    validateWithJoiSchema(body.metadata, metadataValidator);
  }

  if (!notificationSetting?.allowDappPushNotification) {
    //TODO In future we can add a create notification but with  disabledNotification:true
    // So we can exclude them in list of notifications
    return {
      success: true,
      message: errorMessages.USER_TURNED_OF_THIS_NOTIFICATION_TYPE,
    };
  }
  const notificationData: Partial<Notification> = {
    notificationType,
    userAddress,
    email: body.email,
    emailStatus,
    trackId: body?.trackId,
    metadata: body?.metadata,
    segmentData: body.segment,
    projectId,
  };
  if (body.creationTime) {
    // creationTime is optional and it's timestamp in milliseconds format
    notificationData.createdAt = new Date(body.creationTime);
  }
  await createNotification(notificationData);
  return { success: true };
};
