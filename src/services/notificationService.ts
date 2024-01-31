import axios from 'axios';
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
import { SendNotificationRequest } from '../types/requestResponses';
import { StandardError } from '../types/StandardError';

enum EmailNotificationId {
  donationReceived = 'donationReceived',
}

const activityCreator = (payload: any, emailNotificationId: EmailNotificationId) => {
  if (emailNotificationId === EmailNotificationId.donationReceived) {
    return {
      "activities": [
        {
          "activity_id": `act:cm:${emailNotificationId}`,
          "attributes": {
            "str:cm:projecttitle": payload.title,
            "int:cm:donationamount": payload.amount,
            "str:cm:donationtoken": payload.token,
            "str:cm:email": payload.email,
            "str:cm:projectlink": payload.projectLink,
            "bol:cm:verified": payload.verified,
            "str:cm:transactionlink": payload.transactionLink,
          },
          "fields": {
            "str::email": payload.email
          }
        }
      ]
    };
  }
}

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
    notificationTypeId: notificationType.id,
    notificationTypeName: notificationType.name,
    walletAddress: body.userWalletAddress,
    notificationSettingData: {
      id: notificationSetting?.id,
      allowEmailNotification: notificationSetting?.allowEmailNotification,
      allowDappPushNotification: notificationSetting?.allowDappPushNotification,
      allowNotifications: notificationSetting?.allowNotifications,
    },
    trackId: body.trackId,
    metadata: body.metadata,
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
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-us.ortto.app/v1/activities/create',
      headers: {
        'X-Api-Key': process.env.ORTTO_API_KEY as string,
        'Content-Type': 'application/json'
      },
      data: activityCreator(segmentData, EmailNotificationId.donationReceived)
    };
    await axios.request(config);
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
    //TODO In future we can add a create notification but with disabledNotification:true
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
