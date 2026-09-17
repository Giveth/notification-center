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
import {
  NOTIFICATIONS_EVENT_NAMES,
  resolveOrttoActivitySlug,
} from '../types/notifications';
import { getEmailAdapter } from '../adapters/adapterFactory';
import { NOTIFICATION_CATEGORY } from '../types/general';
import { MICRO_SERVICES } from '../utils/utils';

// Finite timeout applied ONLY to the giveth-v6-core#426 contact sync, so a
// stalled Ortto connection fails promptly into its 502 retry path instead of
// leaving the request pending. Sourced from ORTTO_REQUEST_TIMEOUT_MS with a
// validated fallback so a missing/garbage value never disables it.
const DEFAULT_ORTTO_SYNC_TIMEOUT_MS = 10_000;
const resolveOrttoSyncTimeoutMs = (): number => {
  const parsed = Number(process.env.ORTTO_REQUEST_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_ORTTO_SYNC_TIMEOUT_MS;
};

export const activityCreator = (
  payload: any,
  orttoEventName: NOTIFICATIONS_EVENT_NAMES,
  microService: string,
  /**
   * giveth-v6-core#439: resolve through `ORTTO_EVENT_NAMES_V6` first, so v6's
   * events reach v6's own journeys. Absent/false keeps the legacy id, which is
   * what v5 (impact-graph) sends over the same credential — see that map's
   * docblock for why this is a flag and not an edit.
   */
  useV6Activities?: boolean,
): any => {
  let attributes;
  let date;
  switch (orttoEventName) {
    case NOTIFICATIONS_EVENT_NAMES.SUBSCRIBE_ONBOARDING:
      attributes = {
        'str:cm:email': payload.email,
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.SEND_EMAIL_CONFIRMATION:
      attributes = {
        'str:cm:email': payload.email,
        'str:cm:verificationlink': payload.verificationLink,
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW:
      attributes = {
        'str:cm:email': payload.email,
        'int:cm:code': Number(payload.verificationCode),
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.CREATE_ORTTO_PROFILE:
      attributes = {
        'str:cm:email': payload.email,
        'str:cm:firstname': payload.firstName,
        'str:cm:lastname': payload.lastName,
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT:
      // Identity-only: the sync carries just the email + the stable v6 user id
      // (giveth-v6-core#426 sends no names). So the Ortto workspace only needs
      // the two attributes below declared on the `sync-ortto-contact` activity —
      // `str:cm:email` and `str:cm:v6-user-id`.
      attributes = {
        'str:cm:email': payload.email,
        'str:cm:v6-user-id': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.SUPER_TOKENS_BALANCE_DEPLETED:
      attributes = {
        'str:cm:tokensymbol': payload.tokenSymbol,
        'str:cm:email': payload.email,
        'str:cm:userid': payload.userId?.toString(),
        'bol:cm:isended': payload.isEnded,
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.SUPER_TOKENS_BALANCE_WEEK:
      attributes = {
        'str:cm:tokensymbol': payload.tokenSymbol,
        'str:cm:email': payload.email,
        'str:cm:userid': payload.userId?.toString(),
        'str:cm:criticaldate': 'week',
        'bol:cm:isended': payload.isEnded,
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.SUPER_TOKENS_BALANCE_MONTH:
      attributes = {
        'str:cm:tokensymbol': payload.tokenSymbol,
        'str:cm:email': payload.email,
        'str:cm:userid': payload.userId?.toString(),
        'str:cm:criticaldate': 'month',
        'bol:cm:isended': payload.isEnded,
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED:
      attributes = {
        'bol:cm:isrecurringdonation': !!payload.isRecurringDonation,
        'str:cm:projecttitle': payload.title,
        'str:cm:donationamount': payload.amount.toString(),
        'str:cm:donationtoken': payload.token,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'bol:cm:verified': payload.verified,
        'str:cm:transactionlink': payload.transactionLink,
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.DRAFTED_PROJECT_ACTIVATED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:firstname': payload.firstName,
        'str:cm:lastname': payload.lastName,
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_LISTED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_UNLISTED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_CANCELLED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_UPDATE_ADDED_OWNER:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectupdatelink': payload.projectLink + '?tab=updates',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    // giveth-v6-core#439 AC9: "a project you supported posted an update", sent
    // to each donor of the project. The recipient here is the SUPPORTER, not
    // the owner, so `email`/`userId` are theirs; `title`/`projectLink` describe
    // the project they backed. `update` carries the update's title so the
    // template can name it.
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectupdatelink': payload.projectLink + '?tab=updates',
        'str:cm:projectupdatetitle': payload.update,
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:verified-status': 'verified',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    // v5 ONLY — impact-graph's GIVbacks-badge grant, unchanged from before
    // giveth-v6-core#439. It resolves to the LEGACY `project-verification`
    // activity (it has no `ORTTO_EVENT_NAMES_V6` entry and v5 never sends the
    // flag), so it keeps hitting v5's live journey exactly as it does today.
    // v6 sends GIVBACKS_ELIGIBILITY_GRANTED instead — same
    // `verified-status` literal, different event, different journey.
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_GIVBACKS_ELIGIBLE:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:verified-status': 'givbacksEligible',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:verified-status': 'rejected',
        'txt:cm:reason': payload.verificationRejectedReason,
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    // giveth-v6-core#439 AC5: the VERIFIED BADGE being removed, which is a
    // different event from an application being rejected (AC6) and has its own
    // email. The two are told apart by `str:cm:verified-status` alone —
    // 'unverified' here, 'rejected' on the FORM_REJECTED branch, which is also
    // the only branch that sets `txt:cm:reason`.
    //
    // Read off the live journeys, not inferred (2026-09-10): BOTH
    // `v6 Project Verification` and v5's `Project Verification` branch on
    // `str:cm:verified-status` across verified / unverified / rejected /
    // givbacksEligible / revoked, and the `unverified` arm is the one sending
    // "Vouched Badge Removed". The literal must match that branch value
    // EXACTLY; a mismatch fails silently, since the attribute is a free-text
    // `str:` so Ortto returns 2xx, no branch matches and nothing sends.
    //
    // NOT gated on `useV6Activities`, deliberately. impact-graph (v5) fires
    // this event too — `NotificationCenterAdapter.projectUnVerified` with
    // `sendEmail: true`, from the admin panel's verified -> unverified
    // transition — and v5 stays live alongside v6. Sending anything other than
    // 'unverified' without the flag would change which copy v5's real users
    // receive (it would give them the application-rejected template with an
    // empty reason), which is not this ticket's to change. Both apps send the
    // same literal to their own journey; only the ACTIVITY id differs, and
    // that is what `ORTTO_EVENT_NAMES_V6` handles.
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:verified-status': 'unverified',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    // giveth-v6-core#439 AC4: the GIVbacks-eligible badge is a SEPARATE badge
    // from the verified one, so it gets its own `verified-status` value on the
    // shared `project-verification` activity rather than reusing 'verified'
    // (which would make the two grants indistinguishable to the template).
    // The literal must match the Ortto template's branch value EXACTLY —
    // it is camelCase there, not kebab-case like the activity ids. A mismatch
    // fails silently: Ortto still returns 2xx for the activity, the template
    // just matches no branch and sends nothing.
    case NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:verified-status': 'givbacksEligible',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:verified-status': 'revoked',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_WARNING:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectupdatelink': payload.projectLink + '?tab=updates',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectupdatelink': payload.projectLink + '?tab=updates',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    case NOTIFICATIONS_EVENT_NAMES.NOTIFY_REWARD_AMOUNT:
      date = new Date(Number(payload.date));
      attributes = {
        'dtz:cm:date': {
          year: date.getUTCFullYear(),
          month: date.getUTCMonth() + 1, // JavaScript's months are zero-indexed
          day: date.getUTCDate(),
          timezone: 'UTC',
        },
        'int:cm:round': payload.round,
        'str:cm:amount': payload.amount,
        'str:cm:contractaddress': payload.contractAddress,
        'str:cm:farm': payload.farm,
        'str:cm:message': payload.message,
        'str:cm:network': payload.network,
        'str:cm:script': payload.script,
        'str:cm:transactionhash': payload.transactionHash,
      };
      break;
    default:
      logger.debug('activityCreator() invalid event name', orttoEventName);
      return;
  }
  const activitySlug = resolveOrttoActivitySlug(
    orttoEventName,
    useV6Activities,
  );
  if (!activitySlug) {
    logger.debug('activityCreator() invalid ORTTO_EVENT_NAMES', orttoEventName);
    return;
  }
  // giveth-v6-core#426: the v6 contact sync ALWAYS merges on the stable v6 user
  // id (unlike the generic block below, which only does so in production), so a
  // canonical-email change re-points the SAME Ortto person instead of creating
  // a duplicate. It also stamps the durable `bol:cm:sourced-from-v6` marker so
  // v6-managed contacts stay distinguishable from legacy v5-sourced ones.
  if (orttoEventName === NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT) {
    return {
      activities: [
        {
          activity_id: `act:cm:${activitySlug}`,
          attributes,
          fields: {
            'str::email': payload.email,
            'str:cm:v6-user-id': payload.userId?.toString(),
            'bol:cm:sourced-from-v6': true,
          },
        },
      ],
      merge_by: ['str:cm:v6-user-id'],
    };
  }
  const fields = {
    'str::email': payload.email,
  };
  const merge_by = [];
  if (
    process.env.ENVIRONMENT === 'production' &&
    orttoEventName !== NOTIFICATIONS_EVENT_NAMES.SEND_EMAIL_CONFIRMATION &&
    orttoEventName !== NOTIFICATIONS_EVENT_NAMES.NOTIFY_REWARD_AMOUNT &&
    microService !== MICRO_SERVICES.qacc
  ) {
    fields['str:cm:user-id'] = payload.userId?.toString();
    merge_by.push('str:cm:user-id');
  } else {
    merge_by.push('str::email');
  }
  return {
    activities: [
      {
        activity_id: `act:cm:${activitySlug}`,
        attributes,
        fields,
      },
    ],
    merge_by,
  };
};

export const sendNotification = async (
  body: SendNotificationRequest,
  microService: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  const { userWalletAddress, projectId } = body;
  // giveth-v6-core#426: the contact sync must upsert or fail LOUDLY — it may
  // never return a false success, or v6-core marks the user synced and stops
  // retrying a contact that was never created.
  const isSyncOrttoContact =
    body.eventName === NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT;
  // Never let a duplicate trackId short-circuit the sync into a false success.
  // It carries no trackId today, but guard explicitly so that stays true.
  if (
    !isSyncOrttoContact &&
    body.trackId &&
    (await findNotificationByTrackId(body.trackId))
  ) {
    // We dont throw error in this case but dont create new notification neither
    return {
      success: true,
      message: errorMessages.DUPLICATED_TRACK_ID,
    };
  }

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

  const isOrttoSpecific =
    notificationType.category === NOTIFICATION_CATEGORY.ORTTO;

  const userAddress = isOrttoSpecific
    ? undefined
    : await createNewUserAddressIfNotExists(userWalletAddress as string);

  const notificationSetting = isOrttoSpecific
    ? null
    : await findNotificationSettingByNotificationTypeAndUserAddress({
        notificationTypeId: notificationType.id,
        userAddressId: userAddress?.id as number,
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
    // Log only which segment keys were sent, never their values — the payload
    // carries contact PII (email, names, v6-user-id) and this runs at DEBUG.
    payloadKeys: body.segment?.payload ? Object.keys(body.segment.payload) : [],
    sendEmail: body.sendEmail,
    sendSegment: body.sendSegment,
    segmentValidator: !!segmentValidator,
    eventName: body.eventName,
  });

  if (
    ((shouldSendEmail && body.sendSegment) || isOrttoSpecific) &&
    segmentValidator
  ) {
    const emailData = body.segment?.payload;
    // Joi treats an absent object as valid, so a missing segment slips past the
    // per-type validator. For the sync that is a bad request (400), not a
    // silent success and not something to retry.
    if (isSyncOrttoContact && !emailData) {
      throw new StandardError({
        message: errorMessages.ORTTO_CONTACT_SYNC_INVALID_PAYLOAD,
        httpStatusCode: 400,
      });
    }
    const validatedPayload = validateWithJoiSchema(emailData, segmentValidator);
    // Only the sync forwards Joi's COERCED payload (normalised email + integer
    // userId → a single stable merge key); other events keep their exact prior
    // input to avoid any behavioural drift.
    const data = activityCreator(
      isSyncOrttoContact ? validatedPayload : emailData,
      body.eventName as NOTIFICATIONS_EVENT_NAMES,
      microService,
      body.orttoV6Activities,
    );
    if (data) {
      const orttoResult = await getEmailAdapter().callOrttoActivity(
        data,
        microService,
        isSyncOrttoContact
          ? { timeoutMs: resolveOrttoSyncTimeoutMs() }
          : undefined,
      );
      // The sync needs a CONFIRMED upsert (v6-core advances its per-user marker
      // only on a 2xx). Surface a transient Ortto failure (5xx / timeout /
      // network) as 502 so v6-core retries, and a permanent one (4xx — a bad
      // payload or an unprovisioned custom field/activity) as 422 so it is NOT
      // retried forever. Other events ignore the result (fire-and-forget).
      if (isSyncOrttoContact && !orttoResult.ok) {
        throw new StandardError({
          message: errorMessages.ORTTO_CONTACT_SYNC_FAILED,
          httpStatusCode: orttoResult.retryable ? 502 : 422,
        });
      }
    } else if (isSyncOrttoContact) {
      // activityCreator produced nothing for an event that MUST upsert
      // (e.g. the event fell out of ORTTO_EVENT_NAMES) — a misconfiguration,
      // not a silent success.
      throw new StandardError({
        message: errorMessages.ORTTO_CONTACT_SYNC_FAILED,
        httpStatusCode: 500,
      });
    }
    emailStatus = EMAIL_STATUSES.SENT;
  } else if (isSyncOrttoContact) {
    // Reached the ORTTO branch but with no segment validator (a seed/config
    // error): fail rather than returning a false success.
    throw new StandardError({
      message: errorMessages.ORTTO_CONTACT_SYNC_FAILED,
      httpStatusCode: 500,
    });
  }

  if (isOrttoSpecific) {
    return {
      success: true,
      message: errorMessages.ORTTO_SPECIFIC,
    };
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
