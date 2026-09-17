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
  // v5 ONLY. impact-graph still fires this (NotificationCenterAdapter
  // `projectGivbacksEligible`, sendEmail: true) and v5 stays live alongside v6,
  // so the event, its `projectGivbacksEligible` validator and its ORTTO-category
  // seed row must all keep existing. v6 uses GIVBACKS_ELIGIBILITY_GRANTED below
  // instead; the two are deliberately separate so v6's copy can change without
  // touching v5's live journey.
  PROJECT_GIVBACKS_ELIGIBLE = 'Project givbacks eligible',
  PROJECT_VERIFIED_USERS_WHO_SUPPORT = 'Project verified - Users who supported',

  // https://github.com/Giveth/impact-graph/issues/624#issuecomment-1240364389
  PROJECT_REJECTED = 'Project unverified',
  PROJECT_NOT_REVIEWED = 'Project not reviewed',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  PROJECT_UNVERIFIED = 'Project unverified',
  VERIFICATION_FORM_REJECTED = 'Form rejected',
  // giveth-v6-core#439 AC4: the GIVbacks-eligible badge is its own badge in v6,
  // with its own grant email. `PROJECT_VERIFIED` remains the verified badge.
  GIVBACKS_ELIGIBILITY_GRANTED = 'GIVbacks eligibility granted',
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
  // v6 → Ortto contact sync (giveth-v6-core#426). Distinct from
  // CREATE_ORTTO_PROFILE: it always merges on the stable v6 user id (so a
  // canonical-email change re-points the same person instead of duplicating)
  // and stamps a durable "sourced from v6" marker.
  SYNC_ORTTO_CONTACT = 'Sync Ortto contact',
  SEND_EMAIL_CONFIRMATION = 'Send email confirmation',
  SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW = 'Send email confirmation code flow',
  SUBSCRIBE_ONBOARDING = 'Subscribe onboarding',
  NOTIFY_REWARD_AMOUNT = 'Notify reward amount',
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
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_GIVBACKS_ELIGIBLE]: 'project-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED]: 'project-verification',
  // giveth-v6-core#439 AC4. Rides the existing `project-verification` activity
  // rather than a new one: the template already branches on
  // `str:cm:verified-status`, and this adds one more value
  // ('givbacksEligible') alongside verified / rejected / revoked. Nothing new
  // has to be provisioned in the Ortto workspace beyond that template branch.
  [NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED]:
    'project-verification',
  [NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED]:
    'project-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_WARNING]:
    'first-update-warning',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING]:
    'second-update-warning',
  [NOTIFICATIONS_EVENT_NAMES.CREATE_ORTTO_PROFILE]: 'created-profile',
  // DEDICATED, inert activity (giveth-v6-core#426). We intentionally do NOT
  // reuse 'created-profile': the contact sync must be side-effect-free (it
  // creates/updates a contact but sends no email), and it fires again on every
  // canonical-email re-point, so it must not be bound to any Ortto journey that
  // could send a (duplicate) welcome email. This activity must exist in the
  // Ortto workspace with NO automation bound to it.
  [NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT]: 'sync-ortto-contact',
  [NOTIFICATIONS_EVENT_NAMES.SEND_EMAIL_CONFIRMATION]:
    'verification-form-email-verification',
  [NOTIFICATIONS_EVENT_NAMES.NOTIFY_REWARD_AMOUNT]: 'notify-reward',
  [NOTIFICATIONS_EVENT_NAMES.SUBSCRIBE_ONBOARDING]: 'onboarding-form',
  [NOTIFICATIONS_EVENT_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW]:
    'email-verification-code',
};

/**
 * giveth-v6-core#439 — the v6 Ortto activity ids.
 *
 * v6 has its OWN set of Ortto journeys ("v6 Donation Received", "v6 Project
 * Live", …), each triggered by a `v6-`-prefixed activity, so that v6's copy,
 * footer and one-click-unsubscribe (issue #438) are independent of v5's live
 * journeys. This map is the overlay that reaches them.
 *
 * It CANNOT be a straight edit of `ORTTO_EVENT_NAMES`, and that is the whole
 * reason this second table exists: impact-graph (v5) sends the SAME
 * `NOTIFICATIONS_EVENT_NAMES` values over the SAME `givethio` credential, so
 * re-pointing an entry there would silently move v5's production email onto a
 * journey that is switched off. Measured 2026-09-10 on the live Ortto
 * workspace: the legacy journeys bound to those ids are `on` and delivering
 * (DonationReceived 28,599 delivered, Project Listed 5,044, Project Created
 * 3,844, Project Verification 2,298), while every `v6 *` journey is `off` with
 * `entered: 0`.
 *
 * The discriminator is the caller's explicit `orttoV6Activities` flag: additive,
 * and ABSENT falls back to the legacy id, so v5 is untouched by construction.
 *
 * A v6 `microService` would have been the stronger discriminator — unforgeable,
 * no cross-repo wire key, and it would make the stored rows attributable per
 * app. It was not chosen because `findNotificationTypeByEventName` filters on
 * `microService` and the ~68 seeded `NotificationType` rows v6 uses are all
 * `givethio`, so it needs a seed migration re-pointing or duplicating them
 * first. That is a SCOPE decision, not an impossibility: this repo seeds
 * per-microService types routinely (`givEconomyNotificationMicroService` has
 * its own), and adding a credential is one more migration of a kind it writes
 * often. Revisit it rather than treating the flag as settled.
 *
 * Deliberately PARTIAL — an event with no entry here keeps resolving to its
 * existing activity, because a `v6-` id that exists nowhere in the workspace
 * would 400. Three reasons for being absent, none of them an oversight:
 *
 *   - NOT SENT BY v6 (the GIVpower rank events, and `Project givbacks
 *     eligible`, which is v5's GIVbacks-badge event — v6 sends
 *     `GIVbacks eligibility granted` instead): inert either way.
 *   - SENDS NO EMAIL: `Sync Ortto contact` is ORTTO-category and upserts a
 *     contact, so it has no journey to reach.
 *   - TRANSACTIONAL, AND SHARING v5's JOURNEY IS CORRECT:
 *     **`Send email confirmation`**, the GIVbacks eligibility form's
 *     contact-email confirmation. It is NOT one of #439's emails — #439's
 *     always-send item is the ACCOUNT email code (AC10/AC11), which is
 *     `SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW` and does have `v6 Email
 *     Verification`. Its only variable content is the verify link, which v6
 *     supplies itself (`buildVerifyEmailLink` -> `resolveDappBaseUrl`), so the
 *     URL is already v6's. And it must NOT gain #438's unsubscribe footer: it
 *     is flow-critical and always-send, exactly as `v6 Email Verification`'s
 *     own description states. A v6 copy of this journey would differ from v5's
 *     in nothing and add a second template to keep in step.
 *
 * ONE event runs the other way: `Project update added - Users who supported`
 * appears ONLY here and has no legacy id at all. v5 has no Ortto activity for
 * it (it produces an in-app notification only, and impact-graph sends it with
 * neither `sendEmail` nor `sendSegment`), so giving it a legacy id would create
 * a v5 email that has never existed — a trap waiting for the first v5 caller
 * that sets `sendEmail`. Without the flag it resolves to nothing and no Ortto
 * call is made, which is exactly v5's current behaviour.
 *
 * The five verification events share ONE activity, exactly as they do in the
 * legacy map, and are told apart by `str:cm:verified-status` alone. FIVE branch
 * values, one per event — verified / unverified / rejected / givbacksEligible /
 * revoked. The four-value reading, which omits `unverified`, is the bug: it
 * collapsed AC5's badge removal onto AC6's 'rejected' so the removal sent the
 * application-rejected email with an empty reason. See that event's own comment
 * in notificationService.ts, and note v5's journey has the same five.
 */
export const ORTTO_EVENT_NAMES_V6: Partial<
  Record<NOTIFICATIONS_EVENT_NAMES, string>
> = {
  [NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED]: 'v6-donation-received',
  [NOTIFICATIONS_EVENT_NAMES.DRAFTED_PROJECT_ACTIVATED]: 'v6-project-live',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_LISTED]: 'v6-project-listed',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_UNLISTED]: 'v6-project-unlisted',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_CANCELLED]: 'v6-project-cancelled',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED]: 'v6-project-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED]: 'v6-project-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED]: 'v6-project-verification',
  [NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED]:
    'v6-project-verification',
  [NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED]:
    'v6-project-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT]:
    'v6-project-update',
  [NOTIFICATIONS_EVENT_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW]:
    'v6-email-verification',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_WARNING]: 'v6-update-warning',
  [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING]:
    'v6-update-last-warning',
};

/**
 * Which Ortto activity an event resolves to. `undefined` means the event has no
 * activity at all and no Ortto call may be made for it.
 */
export const resolveOrttoActivitySlug = (
  eventName: NOTIFICATIONS_EVENT_NAMES,
  useV6Activities?: boolean,
): string | undefined =>
  (useV6Activities ? ORTTO_EVENT_NAMES_V6[eventName] : undefined) ??
  ORTTO_EVENT_NAMES[eventName];
