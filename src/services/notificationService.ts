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
import { NOTIFICATIONS_EVENT_NAMES, ORTTO_EVENT_NAMES } from '../types/notifications';
import {getEmailAdapter} from "../adapters/adapterFactory";

const activityCreator = (payload: any, orttoEventName: NOTIFICATIONS_EVENT_NAMES) : any=> {
  const fields = {
    "str::email": payload.email,
  }
  if (process.env.ENVIRONMENT === 'production') {
    fields['str:cm:user-id'] = payload.userId?.toString()
  }
  let attributes;
  switch (orttoEventName) {
    case NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:donationamount": payload.amount.toString(),
        "str:cm:donationtoken": payload.token,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
        "bol:cm:verified": payload.verified,
        "str:cm:transactionlink": payload.transactionLink,
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.DRAFTED_PROJECT_ACTIVATED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
        "str:cm:firstname": payload.firstName,
        "str:cm:lastname": payload.lastName,
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_LISTED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_UNLISTED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_CANCELLED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_UPDATE_ADDED_OWNER:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectupdatelink": payload.projectLink + '?tab=updates',
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
        "str:cm:verified-status": 'verified',
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
        "str:cm:verified-status": 'rejected',
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
        "str:cm:verified-status": 'rejected',
      };
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectlink": payload.projectLink,
        "str:cm:verified-status": 'revoked',
      }
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_WARNING:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectupdatelink": payload.projectLink + '?tab=updates',
        "str:cm:user-id": payload.userId?.toString(),
      }
      break
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING:
      attributes = {
        "str:cm:projecttitle": payload.title,
        "str:cm:email": payload.email,
        "str:cm:projectupdatelink": payload.projectLink + '?tab=updates',
        "str:cm:user-id": payload.userId?.toString(),
      }
      break
    default:
      logger.debug('activityCreator() invalid event name', orttoEventName)
      return;
  }
  if (!ORTTO_EVENT_NAMES[orttoEventName]) {
    logger.debug('activityCreator() invalid ORTTO_EVENT_NAMES', orttoEventName)
    return;
  }
  return {
    activities: [
      {
        activity_id: `act:cm:${ORTTO_EVENT_NAMES[orttoEventName]}`,
        attributes,
        fields,
      }
    ]
  };
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
    payload: body.segment?.payload,
    sendEmail: body.sendEmail,
    sendSegment: body.sendSegment,
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
    const emailData = body.segment?.payload;
    validateWithJoiSchema(emailData, segmentValidator);
    const data = activityCreator(emailData, body.eventName as NOTIFICATIONS_EVENT_NAMES);
    if (data) {
      await getEmailAdapter().callOrttoActivity(data);
    }
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
