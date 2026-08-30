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
  ORTTO_EVENT_NAMES,
} from '../types/notifications';
import { getEmailAdapter } from '../adapters/adapterFactory';
import { NOTIFICATION_CATEGORY } from '../types/general';
import { MICRO_SERVICES } from '../utils/utils';

// Finite timeout applied ONLY to the giveth-v6-core#426/#457 contact writes, so
// a stalled Ortto connection fails promptly into its 502 retry path instead of
// leaving the request pending. Sourced from ORTTO_REQUEST_TIMEOUT_MS with a
// validated fallback so a missing/garbage value never disables it.
const DEFAULT_ORTTO_SYNC_TIMEOUT_MS = 10_000;
const resolveOrttoSyncTimeoutMs = (): number => {
  const parsed = Number(process.env.ORTTO_REQUEST_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_ORTTO_SYNC_TIMEOUT_MS;
};

/**
 * The v6 contact WRITES (giveth-v6-core#426 upsert, #457 suppression). Both
 * must be CONFIRMED, not fire-and-forget: v6-core moves a per-user marker only
 * on a 2xx and stops retrying once it has, so a false success here strands a
 * contact that was never created — or, worse for #457, one that was never
 * unsubscribed and keeps receiving mail at an address Giveth stopped trusting.
 *
 * Everything downstream keys off membership in this set rather than a single
 * event comparison: the trackId-dedup bypass, the missing-payload 400, sending
 * Joi's coerced payload, the finite timeout, and the 502/422/500 mapping. Adding
 * an event here is what makes it loud; forgetting to is how it would silently
 * become fire-and-forget.
 */
const MUST_CONFIRM_ORTTO_EVENTS: ReadonlySet<string> = new Set([
  NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT,
  NOTIFICATIONS_EVENT_NAMES.SUPPRESS_ORTTO_CONTACT,
]);

// Human-readable reasons Ortto stores alongside the permission change and shows
// in the contact's subscription history (`str::u-ctx` / `str::s-ctx`).
const ORTTO_SUPPRESS_CONTEXT =
  'Giveth v6: profile no longer has a verified canonical email';
const ORTTO_RESUBSCRIBE_CONTEXT =
  'Giveth v6: profile regained a verified canonical email';

export const activityCreator = (
  payload: any,
  orttoEventName: NOTIFICATIONS_EVENT_NAMES,
  microService: string,
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
    case NOTIFICATIONS_EVENT_NAMES.SUPPRESS_ORTTO_CONTACT:
      // giveth-v6-core#457. ID-only — no email, by design: the profile no
      // longer has a canonical address, and the stale one v6 last synced is
      // exactly what must not be written back. So the `suppress-ortto-contact`
      // activity needs only ONE attribute declared in the Ortto workspace:
      // `str:cm:v6-user-id`.
      attributes = {
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
    case NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:verified-status': 'rejected',
        'str:cm:userid': payload.userId?.toString(),
      };
      break;
    // giveth-v6-core#439 AC4: the GIVbacks-eligible badge is a SEPARATE badge
    // from the verified one, so it gets its own `verified-status` value on the
    // shared `project-verification` activity rather than reusing 'verified'
    // (which would make the two grants indistinguishable to the template).
    case NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED:
      attributes = {
        'str:cm:projecttitle': payload.title,
        'str:cm:email': payload.email,
        'str:cm:projectlink': payload.projectLink,
        'str:cm:verified-status': 'givbacks-eligible',
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
  if (!ORTTO_EVENT_NAMES[orttoEventName]) {
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
          activity_id: `act:cm:${ORTTO_EVENT_NAMES[orttoEventName]}`,
          attributes,
          fields: {
            'str::email': payload.email,
            'str:cm:v6-user-id': payload.userId?.toString(),
            'bol:cm:sourced-from-v6': true,
            // giveth-v6-core#457: undo a suppression v6 itself applied.
            // `bol::p` is Ortto's email permission and it is STICKY, so a
            // contact v6 unsubscribed would stay unmailable through every later
            // re-point unless this flips it back. Spread conditionally and never
            // sent as `false`, so a sync that does not ask for it cannot touch
            // permission at all. v6 asks only when its own
            // `ortto_contact_suppressed_at` marker is set — a marker that
            // records v6 SENT a suppression, not that v6 caused the unsubscribe,
            // so a contact that had already opted out through Ortto's own link
            // before losing its canonical email will be re-subscribed here.
            // Known gap, accepted by the v6 side; closing it needs a permission
            // read this service cannot make today.
            ...(payload.resubscribe === true
              ? {
                  'bol::p': true,
                  'str::s-ctx': ORTTO_RESUBSCRIBE_CONTEXT,
                }
              : {}),
          },
        },
      ],
      merge_by: ['str:cm:v6-user-id'],
    };
  }
  // giveth-v6-core#457: the suppression mirror. Same stable merge key, so it
  // unsubscribes exactly the contact the sync created — never a stranger who
  // happens to share the address, and never a duplicate. `bol::p: false` is
  // Ortto's documented way to unsubscribe a person via the API, and it is
  // preferred over archiving or deleting: those destroy the contact's history
  // and subscription state, and a later re-verify would then build a BRAND-NEW
  // contact — exactly the duplicate #426 AC4 exists to prevent. `str::u-ctx`
  // is the human-readable reason Ortto shows next to the unsubscribe.
  //
  // Note what is NOT here: `str::email`. The person is addressed by id, and the
  // only address v6 still holds is the one it has just stopped trusting.
  if (orttoEventName === NOTIFICATIONS_EVENT_NAMES.SUPPRESS_ORTTO_CONTACT) {
    return {
      activities: [
        {
          activity_id: `act:cm:${ORTTO_EVENT_NAMES[orttoEventName]}`,
          attributes,
          fields: {
            'str:cm:v6-user-id': payload.userId?.toString(),
            'bol:cm:sourced-from-v6': true,
            'bol::p': false,
            'str::u-ctx': ORTTO_SUPPRESS_CONTEXT,
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
        activity_id: `act:cm:${ORTTO_EVENT_NAMES[orttoEventName]}`,
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
  // giveth-v6-core#426/#457: a v6 contact write must land or fail LOUDLY — it
  // may never return a false success, or v6-core moves its per-user marker and
  // stops retrying a contact that was never created (#426) or never
  // unsubscribed (#457). See MUST_CONFIRM_ORTTO_EVENTS.
  const isOrttoContactWrite = MUST_CONFIRM_ORTTO_EVENTS.has(body.eventName);
  const isSuppressOrttoContact =
    body.eventName === NOTIFICATIONS_EVENT_NAMES.SUPPRESS_ORTTO_CONTACT;
  // Never let a duplicate trackId short-circuit a contact write into a false
  // success. Neither carries a trackId today, but guard explicitly so that
  // stays true.
  if (
    !isOrttoContactWrite &&
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
    // per-type validator. For a v6 contact write that is a bad request (400),
    // not a silent success and not something to retry.
    if (isOrttoContactWrite && !emailData) {
      throw new StandardError({
        message: errorMessages.ORTTO_CONTACT_SYNC_INVALID_PAYLOAD,
        httpStatusCode: 400,
      });
    }
    const validatedPayload = validateWithJoiSchema(emailData, segmentValidator);
    // Only the v6 contact writes forward Joi's COERCED payload (normalised
    // email + integer userId → a single stable merge key); other events keep
    // their exact prior input to avoid any behavioural drift.
    const data = activityCreator(
      isOrttoContactWrite ? validatedPayload : emailData,
      body.eventName as NOTIFICATIONS_EVENT_NAMES,
      microService,
    );
    if (data) {
      const orttoResult = await getEmailAdapter().callOrttoActivity(
        data,
        microService,
        isOrttoContactWrite
          ? { timeoutMs: resolveOrttoSyncTimeoutMs() }
          : undefined,
      );
      // A v6 contact write needs a CONFIRMED result (v6-core advances its
      // per-user marker only on a 2xx). Surface a transient Ortto failure (5xx /
      // timeout / network) as 502 so v6-core retries, and a permanent one (4xx —
      // a bad payload or an unprovisioned custom field/activity) as 422 so it is
      // NOT retried forever. Other events ignore the result (fire-and-forget).
      if (isOrttoContactWrite && !orttoResult.ok) {
        throw new StandardError({
          message: isSuppressOrttoContact
            ? errorMessages.ORTTO_CONTACT_SUPPRESS_FAILED
            : errorMessages.ORTTO_CONTACT_SYNC_FAILED,
          httpStatusCode: orttoResult.retryable ? 502 : 422,
        });
      }
    } else if (isOrttoContactWrite) {
      // activityCreator produced nothing for an event that MUST reach Ortto
      // (e.g. the event fell out of ORTTO_EVENT_NAMES) — a misconfiguration,
      // not a silent success.
      throw new StandardError({
        message: isSuppressOrttoContact
          ? errorMessages.ORTTO_CONTACT_SUPPRESS_FAILED
          : errorMessages.ORTTO_CONTACT_SYNC_FAILED,
        httpStatusCode: 500,
      });
    }
    emailStatus = EMAIL_STATUSES.SENT;
  } else if (isOrttoContactWrite) {
    // Reached the ORTTO branch but with no segment validator (a seed/config
    // error): fail rather than returning a false success.
    throw new StandardError({
      message: isSuppressOrttoContact
        ? errorMessages.ORTTO_CONTACT_SUPPRESS_FAILED
        : errorMessages.ORTTO_CONTACT_SYNC_FAILED,
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
