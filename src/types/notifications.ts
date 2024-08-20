export enum NOTIFICATIONS_EVENT_NAMES {
  DRAFTED_PROJECT_ACTIVATED = 'Draft published',
  PROJECT_LISTED = 'Project listed',
  PROJECT_UNLISTED = 'Project unlisted',
  PROJECT_UNLISTED_SUPPORTED = 'Project unlisted - Users who supported',
  PROJECT_LISTED_SUPPORTED = 'Project listed - Users who supported',
  PROJECT_EDITED = 'Project edited',
  PROJECT_BADGE_REVOKED = 'Project badge revoked',
  PROJECT_BADGE_REVOKE_REMINDER = 'Project badge revoke reminder',
  PROJECT_BADGE_REVOKE_WARNING = 'Project badge revoke warning',
  PROJECT_BADGE_REVOKE_LAST_WARNING = 'Project badge revoke last warning',
  PROJECT_BADGE_UP_FOR_REVOKING = 'Project badge up for revoking',
  PROJECT_BOOSTED = 'Project boosted',
  PROJECT_BOOSTED_BY_PROJECT_OWNER = 'Project boosted by project owner',
  PROJECT_VERIFIED = 'Project verified',
  PROJECT_VERIFIED_USERS_WHO_SUPPORT = 'Project verified - Users who supported',

  // https://github.com/Giveth/impact-graph/issues/624#issuecomment-1240364389
  PROJECT_REJECTED = 'Project unverified',
  PROJECT_NOT_REVIEWED = 'Project not reviewed',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  PROJECT_UNVERIFIED = 'Project unverified',
  VERIFICATION_FORM_REJECTED = 'Form rejected',
  PROJECT_UNVERIFIED_USERS_WHO_SUPPORT = 'Project unverified - Users who supported',
  PROJECT_ACTIVATED = 'Project activated',
  PROJECT_ACTIVATED_USERS_WHO_SUPPORT = 'Project activated - Users who supported',
  PROJECT_DEACTIVATED = 'Project deactivated',
  PROJECT_DEACTIVATED_USERS_WHO_SUPPORT = 'Project deactivated - Users who supported',

  PROJECT_CANCELLED = 'Project cancelled',
  PROJECT_CANCELLED_USERS_WHO_SUPPORT = 'Project cancelled - Users who supported',
  MADE_DONATION = 'Made donation',
  DONATION_RECEIVED = 'Donation received',
  DONATION_GET_PRICE_FAILED = 'Donation get price failed',
  PROJECT_RECEIVED_HEART = 'project liked',
  PROJECT_UPDATE_ADDED_OWNER = 'Project update added - owner',
  PROJECT_CREATED = 'The project saved as draft',
  UPDATED_PROFILE = 'Updated profile',
  GET_DONATION_PRICE_FAILED = 'Get Donation Price Failed',
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN = 'Verification form got draft by admin',
  RAW_HTML_BROADCAST = 'Raw HTML Broadcast',
  PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT = 'Project update added - Users who supported',

  // https://github.com/Giveth/impact-graph/issues/774#issuecomment-1542337083
  PROJECT_HAS_RISEN_IN_THE_RANK = 'Your Project has risen in the rank',
  PROJECT_HAS_A_NEW_RANK = 'Your project has a new rank',
  YOUR_PROJECT_GOT_A_RANK = 'Your project got a rank',
  SUPER_TOKENS_BALANCE_WEEK = 'One week left in stream balance',
  SUPER_TOKENS_BALANCE_MONTH = 'One month left in stream balance',
  SUPER_TOKENS_BALANCE_DEPLETED = 'Stream balance depleted',
  CREATE_ORTTO_PROFILE = 'Create Ortto profile',
  SEND_EMAIL_CONFIRMATION = 'Send email confirmation',
  SUBSCRIBE_ONBOARDING = 'Subscribe onboarding',
  NOTIFY_REWARD_AMOUNT = 'Notify reward amount',
  DONATION_RECEIVED_FOR_QACC = 'Donation received for qacc',
}

export const ORTTO_EVENT_NAMES = {
  [NOTIFICATIONS_EVENT_NAMES.SUPER_TOKENS_BALANCE_WEEK]:
    'superfluid-balance-warning',
  [NOTIFICATIONS_EVENT_NAMES.SUPER_TOKENS_BALANCE_MONTH]:
    'superfluid-balance-warning',
  [NOTIFICATIONS_EVENT_NAMES.SUPER_TOKENS_BALANCE_DEPLETED]:
    'superfluid-balance-warning',
  [NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED]: 'testing-donation-received',
  [NOTIFICATIONS_EVENT_NAMES.DRAFTED_PROJECT_ACTIVATED]: 'project-created',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_LISTED]: 'project-listed',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_UNLISTED]: 'project-unlisted',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_CANCELLED]: 'project-deactivated',
  [NOTIFICATIONS_EVENT_NAMES.MADE_DONATION]: 'donation-made',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED]: 'project-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED]: 'project-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED]: 'project-verification',
  [NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED]:
    'project-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_WARNING]:
    'first-update-warning',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING]:
    'second-update-warning',
  [NOTIFICATIONS_EVENT_NAMES.CREATE_ORTTO_PROFILE]: 'created-profile',
  [NOTIFICATIONS_EVENT_NAMES.SEND_EMAIL_CONFIRMATION]:
    'verification-form-email-verification',
  [NOTIFICATIONS_EVENT_NAMES.NOTIFY_REWARD_AMOUNT]: 'notify-reward',
  [NOTIFICATIONS_EVENT_NAMES.SUBSCRIBE_ONBOARDING]: 'onboarding-form',
  [NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED_FOR_QACC]:
    'qacc-donation-received',
};
