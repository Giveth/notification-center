import { expect } from 'chai';
import { activityCreator } from './notificationService';
import {
  NOTIFICATIONS_EVENT_NAMES,
  ORTTO_EVENT_NAMES_V6,
} from '../types/notifications';
import { MICRO_SERVICES } from '../utils/utils';
import { SEGMENT_METADATA_SCHEMA_VALIDATOR } from '../utils/validators/segmentAndMetadataValidators';
import { validateWithJoiSchema } from '../validators/schemaValidators';

describe('activityCreator', () => {
  it('should create attributes for NOTIFY_REWARD_AMOUNT', () => {
    const payload = {
      round: 1,
      date: '1721668910580',
      amount: '1000',
      contractAddress: '0x123',
      farm: 'Test Farm',
      message: 'Test Message',
      network: 'Test Network',
      script: 'Test Script',
      transactionHash: '0xabc',
      email: 'test@example.com',
    };
    const result = activityCreator(
      payload,
      NOTIFICATIONS_EVENT_NAMES.NOTIFY_REWARD_AMOUNT,
      MICRO_SERVICES.givethio,
    );
    expect(JSON.stringify(result)).equal(
      JSON.stringify({
        activities: [
          {
            activity_id: 'act:cm:notify-reward',
            attributes: {
              'dtz:cm:date': {
                year: 2024,
                month: 7,
                day: 22,
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
            },
            fields: {
              'str::email': payload.email,
            },
          },
        ],
        merge_by: ['str::email'],
      }),
    );
  });

  // giveth-v6-core#426 — the contact sync's cross-layer contract with v6-core.
  it('builds the SYNC_ORTTO_CONTACT activity: identity-only, dedicated inert activity, merges on the v6 user id, stamps the sourced-from-v6 marker', () => {
    // Names in the payload are ignored — the sync is identity-only.
    const payload = {
      email: 'contact@example.com',
      userId: 42,
      firstName: 'Ada',
      lastName: 'Lovelace',
    };
    const result = activityCreator(
      payload,
      NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT,
      MICRO_SERVICES.givethio,
    );
    expect(result).to.deep.equal({
      activities: [
        {
          activity_id: 'act:cm:sync-ortto-contact',
          attributes: {
            'str:cm:email': 'contact@example.com',
            'str:cm:v6-user-id': '42',
          },
          fields: {
            'str::email': 'contact@example.com',
            'str:cm:v6-user-id': '42',
            'bol:cm:sourced-from-v6': true,
          },
        },
      ],
      merge_by: ['str:cm:v6-user-id'],
    });
  });

  it('merges the SYNC_ORTTO_CONTACT person on the v6 user id regardless of ENVIRONMENT (AC4 on staging)', () => {
    const original = process.env.ENVIRONMENT;
    process.env.ENVIRONMENT = 'production';
    try {
      const result = activityCreator(
        { email: 'contact@example.com', userId: 7 },
        NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT,
        MICRO_SERVICES.givethio,
      );
      // Never merges by email (that would create a duplicate on re-point), and
      // never falls through to the generic prod block's 'str:cm:user-id'.
      expect(result.merge_by).to.deep.equal(['str:cm:v6-user-id']);
      expect(result.activities[0].fields).to.deep.equal({
        'str::email': 'contact@example.com',
        'str:cm:v6-user-id': '7',
        'bol:cm:sourced-from-v6': true,
      });
    } finally {
      // Restore exactly: if ENVIRONMENT was unset, delete it rather than
      // assigning `undefined` (which would leave the string "undefined").
      if (original === undefined) {
        delete process.env.ENVIRONMENT;
      } else {
        process.env.ENVIRONMENT = original;
      }
    }
  });
});

describe('syncOrttoContact segment validator (giveth-v6-core#426)', () => {
  const schema = SEGMENT_METADATA_SCHEMA_VALIDATOR.syncOrttoContact.segment!;

  it('coerces email (trim + lowercase) and userId (→ integer) so the merge key is stable', () => {
    const value = validateWithJoiSchema(
      { email: '  Contact@Example.COM ', userId: '42' },
      schema,
    );
    expect(value.email).to.equal('contact@example.com');
    expect(value.userId).to.equal(42);
    // The coerced userId stringifies to one canonical merge key regardless of
    // the input's representation (' 42 ', '042', 42 all → '42').
    expect(value.userId.toString()).to.equal('42');
  });

  it("rejects a malformed email (it is Ortto's identity field)", () => {
    expect(() =>
      validateWithJoiSchema({ email: 'not-an-email', userId: 42 }, schema),
    ).to.throw();
  });

  it('rejects a non-integer or non-positive userId (would split one user into several contacts)', () => {
    expect(() =>
      validateWithJoiSchema({ email: 'a@b.com', userId: -1.5 }, schema),
    ).to.throw();
    expect(() =>
      validateWithJoiSchema({ email: 'a@b.com', userId: 0 }, schema),
    ).to.throw();
    expect(() =>
      validateWithJoiSchema({ email: 'a@b.com', userId: 'abc' }, schema),
    ).to.throw();
  });

  it('requires both email and userId', () => {
    expect(() => validateWithJoiSchema({ userId: 42 }, schema)).to.throw();
    expect(() =>
      validateWithJoiSchema({ email: 'a@b.com' }, schema),
    ).to.throw();
  });
});

/**
 * giveth-v6-core#439 — the v6 event set's cross-layer contract with v6-core.
 * Each of these events was unreachable before: without an ORTTO_EVENT_NAMES
 * entry `activityCreator` returns undefined and no Ortto activity is ever sent,
 * and without a non-null segment validator `sendNotification` never calls
 * `activityCreator` in the first place.
 */
describe('v6 event-triggered emails (giveth-v6-core#439)', () => {
  const projectPayload = {
    email: 'owner@example.com',
    title: 'Clean Water',
    slug: 'clean-water',
    projectLink: 'https://giveth.io/project/clean-water',
    firstName: 'Ada',
    lastName: 'Lovelace',
    userId: 7,
    OwnerId: 7,
  };

  // AC4: the GIVbacks-eligible badge is a SEPARATE badge from the verified one.
  describe('GIVBACKS_ELIGIBILITY_GRANTED', () => {
    it('rides the project-verification activity with its own verified-status', () => {
      const result = activityCreator(
        projectPayload,
        NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED,
        MICRO_SERVICES.givethio,
      );

      expect(result).to.not.equal(undefined);
      expect(result.activities[0].activity_id).to.equal(
        'act:cm:project-verification',
      );
      expect(result.activities[0].attributes).to.deep.equal({
        'str:cm:projecttitle': 'Clean Water',
        'str:cm:email': 'owner@example.com',
        'str:cm:projectlink': 'https://giveth.io/project/clean-water',
        'str:cm:verified-status': 'givbacksEligible',
        'str:cm:userid': '7',
      });
    });

    it('is distinguishable from the verified badge, which shares the activity', () => {
      const givbacks = activityCreator(
        projectPayload,
        NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED,
        MICRO_SERVICES.givethio,
      );
      const verified = activityCreator(
        projectPayload,
        NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED,
        MICRO_SERVICES.givethio,
      );

      expect(givoStatus(givbacks)).to.equal('givbacksEligible');
      expect(givoStatus(verified)).to.equal('verified');
    });

    it('has a segment validator, without which no Ortto call is ever made', () => {
      const schema =
        SEGMENT_METADATA_SCHEMA_VALIDATOR.givbacksEligibilityGranted.segment;
      expect(schema).to.not.equal(null);
      expect(() =>
        validateWithJoiSchema(projectPayload, schema!),
      ).to.not.throw();
    });
  });

  // AC9: the only supporter-facing email in v6.
  describe('PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT', () => {
    const supporterPayload = {
      ...projectPayload,
      email: 'donor@example.com',
      userId: 55,
      update: 'We reached the first well',
    };

    it('builds a project-update-added activity pointing at the updates tab', () => {
      const result = activityCreator(
        supporterPayload,
        NOTIFICATIONS_EVENT_NAMES.PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT,
        MICRO_SERVICES.givethio,
      );

      expect(result).to.not.equal(undefined);
      expect(result.activities[0].activity_id).to.equal(
        'act:cm:project-update-added',
      );
      expect(result.activities[0].attributes).to.deep.equal({
        'str:cm:projecttitle': 'Clean Water',
        'str:cm:email': 'donor@example.com',
        'str:cm:projectupdatelink':
          'https://giveth.io/project/clean-water?tab=updates',
        'str:cm:projectupdatetitle': 'We reached the first well',
        'str:cm:userid': '55',
      });
    });

    it('addresses the SUPPORTER, not the project owner', () => {
      const result = activityCreator(
        supporterPayload,
        NOTIFICATIONS_EVENT_NAMES.PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT,
        MICRO_SERVICES.givethio,
      );
      expect(result.activities[0].fields['str::email']).to.equal(
        'donor@example.com',
      );
    });

    it('has a segment validator that accepts the update title', () => {
      const schema =
        SEGMENT_METADATA_SCHEMA_VALIDATOR.projectUpdateAddedWhoSupported
          .segment;
      expect(schema).to.not.equal(null);
      expect(() =>
        validateWithJoiSchema(supporterPayload, schema!),
      ).to.not.throw();
    });
  });

  // AC2 / AC3 / AC5 / AC6 / AC7 ride event types v5 already wired end-to-end.
  // Assert that here so a future edit to ORTTO_EVENT_NAMES or the validator map
  // cannot silence one of them without a test failing.
  const alreadyWired: Array<[string, NOTIFICATIONS_EVENT_NAMES, string]> = [
    [
      'AC1 donation received',
      NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED,
      'donationReceived',
    ],
    [
      'AC2 project live',
      NOTIFICATIONS_EVENT_NAMES.DRAFTED_PROJECT_ACTIVATED,
      'draftedProjectPublishedValidator',
    ],
    ['AC3 listed', NOTIFICATIONS_EVENT_NAMES.PROJECT_LISTED, 'projectListed'],
    [
      'AC3 unlisted',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_UNLISTED,
      'projectUnlisted',
    ],
    [
      'AC4 verified badge',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED,
      'projectVerified',
    ],
    [
      'AC5 verified removed',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED,
      'projectUnverified',
    ],
    [
      'AC5 givbacks revoked',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED,
      'projectBadgeRevoked',
    ],
    [
      'AC6 rejected',
      NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED,
      'verificationFormRejected',
    ],
    [
      'AC7 cancelled',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_CANCELLED,
      'projectCancelled',
    ],
  ];

  alreadyWired.forEach(([label, eventName, validatorName]) => {
    it(`${label} reaches Ortto (activity + segment validator)`, () => {
      const payload =
        eventName === NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED
          ? { ...projectPayload, amount: 5, token: 'ETH', verified: true }
          : projectPayload;
      const result = activityCreator(
        payload,
        eventName,
        MICRO_SERVICES.givethio,
      );
      expect(result, `${label}: activityCreator returned nothing`).to.not.equal(
        undefined,
      );
      expect(
        SEGMENT_METADATA_SCHEMA_VALIDATOR[validatorName].segment,
        `${label}: segment validator is null, so no Ortto call is made`,
      ).to.not.equal(null);
    });
  });
});

const givoStatus = (result: any): string =>
  result.activities[0].attributes['str:cm:verified-status'];

/**
 * giveth-v6-core#439 — the v6 Ortto activity overlay.
 *
 * Measured on the live Ortto workspace 2026-09-10: every `v6 *` journey was
 * `off` with `entered: 0`, its description naming a `act:cm:v6-*` trigger,
 * while notification-center was sending the legacy ids — so v6's events were
 * being served by v5's journeys and none of v6's own had ever run.
 *
 * The CONTROL in each case is the v5 direction. Repointing `ORTTO_EVENT_NAMES`
 * itself would satisfy every "v6 resolves to v6-*" assertion equally well and
 * would silently move impact-graph's live production email onto a switched-off
 * journey, so an assertion about v6 alone is worth nothing here.
 */
describe('ORTTO_EVENT_NAMES_V6 overlay', () => {
  const projectPayload = {
    email: 'owner@example.com',
    title: 'Clean Water',
    slug: 'clean-water',
    projectLink: 'https://giveth.io/project/clean-water',
    firstName: 'Ada',
    userId: 7,
  };
  const activityId = (r: any) => r?.activities?.[0]?.activity_id;

  // `DONATION_RECEIVED` reads donation-specific attributes (`amount` is
  // dereferenced unguarded), so it cannot share the project payload.
  const donationPayload = {
    ...projectPayload,
    amount: '25',
    token: 'GIV',
    transactionLink: 'https://etherscan.io/tx/0xabc',
    verified: true,
  };
  // Only DONATION_RECEIVED needs a payload of its own. The #440 ladder builders
  // read title / email / projectLink / userId, all of which projectPayload has.
  const payloadFor = (eventName: NOTIFICATIONS_EVENT_NAMES) =>
    eventName === NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED
      ? donationPayload
      : projectPayload;

  const cases: Array<[string, NOTIFICATIONS_EVENT_NAMES, string, string]> = [
    [
      'AC1 donation received',
      NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED,
      'act:cm:v6-donation-received',
      'act:cm:testing-donation-received',
    ],
    [
      'AC2 project live',
      NOTIFICATIONS_EVENT_NAMES.DRAFTED_PROJECT_ACTIVATED,
      'act:cm:v6-project-live',
      'act:cm:project-created',
    ],
    [
      'AC3 listed',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_LISTED,
      'act:cm:v6-project-listed',
      'act:cm:project-listed',
    ],
    [
      'AC3 unlisted',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_UNLISTED,
      'act:cm:v6-project-unlisted',
      'act:cm:project-unlisted',
    ],
    [
      'AC4 verified badge',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED,
      'act:cm:v6-project-verification',
      'act:cm:project-verification',
    ],
    [
      'AC4 givbacks badge',
      NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED,
      'act:cm:v6-project-verification',
      'act:cm:project-verification',
    ],
    [
      'AC5 badge revoked',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED,
      'act:cm:v6-project-verification',
      'act:cm:project-verification',
    ],
    [
      'AC6 form rejected',
      NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED,
      'act:cm:v6-project-verification',
      'act:cm:project-verification',
    ],
    [
      'AC7 cancelled',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_CANCELLED,
      'act:cm:v6-project-cancelled',
      'act:cm:project-deactivated',
    ],
    [
      'AC5 verified removed',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED,
      'act:cm:v6-project-verification',
      'act:cm:project-verification',
    ],
    // #440's ladder. These two are pinned INDIVIDUALLY rather than left to the
    // set-equality case below, which is invariant under a permutation: swap
    // these two values and every other assertion here still passes while the
    // last warning sends first-warning copy.
    [
      '#440 first update warning',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_WARNING,
      'act:cm:v6-update-warning',
      'act:cm:first-update-warning',
    ],
    [
      '#440 last update warning',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING,
      'act:cm:v6-update-last-warning',
      'act:cm:second-update-warning',
    ],
  ];

  cases.forEach(([label, eventName, v6Id, legacyId]) => {
    it(`${label}: v6 reaches ${v6Id}, v5 keeps ${legacyId}`, () => {
      const payload = payloadFor(eventName);
      expect(
        activityId(
          activityCreator(payload, eventName, MICRO_SERVICES.givethio, true),
        ),
      ).to.equal(v6Id);
      // CONTROL — impact-graph sends the same event name over the same
      // credential and must be untouched.
      expect(
        activityId(
          activityCreator(payload, eventName, MICRO_SERVICES.givethio),
        ),
      ).to.equal(legacyId);
    });
  });

  it('AC9 supporters update: v6 reaches its own journey, v5 keeps the legacy activity', () => {
    const supporterPayload = {
      email: 'donor@example.com',
      title: 'Clean Water',
      slug: 'clean-water',
      projectLink: 'https://giveth.io/project/clean-water',
      firstName: 'Ada',
      userId: 9,
      update: 'We finished the well',
    };
    expect(
      activityId(
        activityCreator(
          supporterPayload,
          NOTIFICATIONS_EVENT_NAMES.PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT,
          MICRO_SERVICES.givethio,
          true,
        ),
      ),
    ).to.equal('act:cm:v6-project-update');
    expect(
      activityId(
        activityCreator(
          supporterPayload,
          NOTIFICATIONS_EVENT_NAMES.PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT,
          MICRO_SERVICES.givethio,
        ),
      ),
    ).to.equal('act:cm:project-update-added');
  });

  it('AC10/AC11 verification code: v6 reaches its own journey', () => {
    const codePayload = {
      email: 'owner@example.com',
      verificationCode: '123456',
      userId: 7,
    };
    expect(
      activityId(
        activityCreator(
          codePayload,
          NOTIFICATIONS_EVENT_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
          MICRO_SERVICES.givethio,
          true,
        ),
      ),
    ).to.equal('act:cm:v6-email-verification');
    expect(
      activityId(
        activityCreator(
          codePayload,
          NOTIFICATIONS_EVENT_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
          MICRO_SERVICES.givethio,
        ),
      ),
    ).to.equal('act:cm:email-verification-code');
  });

  /**
   * The overlay is PARTIAL on purpose. `Sync Ortto contact` has no `v6 *`
   * journey in the workspace, so a v6 caller must still reach the activity that
   * exists — resolving it to a `v6-` id would 400 (unprovisioned activity) and
   * take #426's contact sync down with it.
   */
  it('falls back to the legacy activity for an event with no v6 journey', () => {
    const syncPayload = { email: 'owner@example.com', userId: 7 };
    [true, false].forEach(useV6 => {
      expect(
        activityId(
          activityCreator(
            syncPayload,
            NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT,
            MICRO_SERVICES.givethio,
            useV6,
          ),
        ),
      ).to.equal('act:cm:sync-ortto-contact');
    });
  });

  /**
   * A CHANGE DETECTOR, not a check against Ortto.
   *
   * `provisioned` is a hand-written copy of the ten trigger ids read off the
   * live workspace on 2026-09-10 (each journey's "People enter when", verified
   * one by one in the Ortto UI — the API exposes no trigger field, so there is
   * nothing to assert against programmatically). So this compares the map to a
   * mirror of itself: if a `v6 *` journey is renamed or deleted in the
   * workspace, THIS TEST STAYS GREEN and the email silently stops arriving.
   *
   * What it does buy: an id edited on THIS side, in either direction, has to be
   * edited in both places, which is the moment to go and re-read the workspace.
   * A typo is otherwise invisible — Ortto 400s an unprovisioned activity, the
   * notification row is still written, and the email just never comes.
   */
  it('names only the trigger ids verified in the Ortto workspace', () => {
    const provisioned = new Set([
      'v6-donation-received',
      'v6-project-live',
      'v6-project-listed',
      'v6-project-unlisted',
      'v6-project-verification',
      'v6-project-cancelled',
      'v6-project-update',
      'v6-email-verification',
      'v6-update-warning',
      'v6-update-last-warning',
    ]);
    const used = new Set(Object.values(ORTTO_EVENT_NAMES_V6));
    expect([...used].filter(id => !provisioned.has(id))).to.deep.equal([]);
    // ...and every provisioned journey is reachable, or a template nobody can
    // trigger sits switched on at go-live.
    expect([...provisioned].filter(id => !used.has(id))).to.deep.equal([]);
  });
});

/**
 * giveth-v6-core#439 AC4/AC5/AC6 — the five events that SHARE the
 * `project-verification` activity are told apart only by
 * `str:cm:verified-status`, so that value is the whole of the routing.
 *
 * Read off the live `v6 Project Verification` journey 2026-09-10, which
 * branches across exactly these five values:
 *
 *   verified         -> Vouched/Verified
 *   unverified       -> Vouched Badge Removed
 *   rejected         -> Project Verification - Rejected
 *   givbacksEligible -> Project Verification - GIVbacks Approved
 *   revoked          -> GIVbacks Eligible Badge Revoked
 *
 * The bug this pins: PROJECT_UNVERIFIED sent 'rejected', the same value as
 * VERIFICATION_FORM_REJECTED. A verified-badge removal therefore got the
 * APPLICATION-REJECTED email — whose reason slot is fed by `txt:cm:reason`,
 * set only on the rejected branch, so it rendered empty — and the `unverified`
 * branch never ran. Nothing caught it: the activity, the segment validator and
 * the Ortto response are identical either way, and this value was asserted
 * nowhere.
 *
 * DISTINCTNESS is the property, not the individual strings. Any two events
 * sharing a value silently collapse into one email, which is what happened.
 */
describe('project-verification verified-status routing', () => {
  const payload = {
    email: 'owner@example.com',
    title: 'Clean Water',
    slug: 'clean-water',
    projectLink: 'https://giveth.io/project/clean-water',
    firstName: 'Ada',
    userId: 7,
    verificationRejectedReason: 'Needs more detail',
  };
  const statusOf = (eventName: NOTIFICATIONS_EVENT_NAMES, useV6 = true) =>
    activityCreator(payload, eventName, MICRO_SERVICES.givethio, useV6)
      ?.activities?.[0]?.attributes?.['str:cm:verified-status'];

  // The branch values the live journeys actually have.
  const expected: Array<[string, NOTIFICATIONS_EVENT_NAMES, string]> = [
    [
      'AC4 verified granted',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED,
      'verified',
    ],
    [
      'AC5 verified removed',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED,
      'unverified',
    ],
    [
      'AC6 application rejected',
      NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED,
      'rejected',
    ],
    [
      'AC4 givbacks granted',
      NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED,
      'givbacksEligible',
    ],
    [
      'AC5 givbacks revoked',
      NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED,
      'revoked',
    ],
  ];

  expected.forEach(([label, eventName, value]) => {
    it(`${label} routes to the '${value}' branch`, () => {
      expect(statusOf(eventName)).to.equal(value);
    });
  });

  /**
   * ⚠️ THE v5 CONTROL, and the reason `statusOf` takes the flag at all.
   *
   * This switch's attributes are SHARED — only the activity id is overlaid —
   * and impact-graph fires PROJECT_UNVERIFIED itself (NotificationCenterAdapter,
   * `sendEmail: true`, from the admin panel's verified -> unverified) without
   * the flag. So a value changed here reaches v5's live journey, 2,298
   * delivered. An assertion on the v6 path alone pins the CHANGED v5 path as
   * correct and the regression is invisible by construction; this case is what
   * makes it visible.
   *
   * v5 keeps 'rejected' even though its own `unverified` branch is switched ON
   * with 0 sends against `rejected`'s 135 — v5 has the same defect. Fixing it
   * changes which copy real v5 users receive and belongs in a v5 change.
   */
  it('leaves the v5 path on its existing value', () => {
    expect(
      statusOf(NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED, false),
    ).to.equal('rejected');
    expect(
      statusOf(NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED, true),
    ).to.equal('unverified');
  });

  /**
   * PROJECT_UNVERIFIED is the ONLY attribute anywhere in this switch that may
   * differ between v5 and v6. Everything else is shared on purpose, so gating
   * a second thing by copy-paste silently forks v5's routing.
   *
   * Deliberately NOT written over the `expected` table or over
   * `str:cm:verified-status`: that covers 4 of the switch's 23 arms and one
   * attribute out of all of them, so gating `str:cm:donationamount` on
   * DONATION_RECEIVED, or `txt:cm:reason` anywhere, would fork v5 and still
   * pass. It walks EVERY event the switch handles and compares the WHOLE
   * attributes object, so a gate added anywhere in it fails here.
   *
   * `activity_id` is excluded because overlaying it is the entire point of
   * `ORTTO_EVENT_NAMES_V6`; only `attributes` must match.
   */
  it('keeps every attribute of every other event identical for v5 and v6', () => {
    // A union of every field any arm of the switch reads, so one payload
    // satisfies all 23. `date` is fixed — the one arm that builds a Date reads
    // it from here, never from the clock, so the two calls stay comparable.
    const unionPayload = {
      ...payload,
      amount: '25',
      token: 'GIV',
      transactionLink: 'https://etherscan.io/tx/0xabc',
      verified: true,
      date: '1721668910580',
      round: 1,
      contractAddress: '0x123',
      farm: 'Test Farm',
      message: 'Test Message',
      network: 'Test Network',
      script: 'Test Script',
      transactionHash: '0xabc',
      tokenSymbol: 'GIV',
      isEnded: false,
      isRecurringDonation: false,
      lastName: 'Lovelace',
      update: 'We finished the well',
      verificationCode: '123456',
      verificationLink: 'https://giveth.io/verify?code=123456',
      verificationRejectedReason: 'Needs more detail',
    };
    const attributesOf = (
      eventName: NOTIFICATIONS_EVENT_NAMES,
      useV6: boolean,
    ) =>
      activityCreator(unionPayload, eventName, MICRO_SERVICES.givethio, useV6)
        ?.activities?.[0]?.attributes;

    const handled = Object.values(NOTIFICATIONS_EVENT_NAMES).filter(
      eventName =>
        eventName !== NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED &&
        attributesOf(eventName, false) !== undefined,
    );

    // Guards the loop itself: an `activityCreator` that started returning
    // undefined would make every assertion below vacuous.
    expect(handled.length).to.be.greaterThan(15);

    handled.forEach(eventName => {
      expect(
        attributesOf(eventName, true),
        `${eventName} must not differ between v5 and v6`,
      ).to.deep.equal(attributesOf(eventName, false));
    });
  });

  it('gives each of the five events a DISTINCT branch', () => {
    const values = expected.map(([, eventName]) => statusOf(eventName));
    expect(new Set(values).size).to.equal(expected.length);
  });

  /**
   * The reason slot belongs to AC6 alone: AC5's badge removal has no admin
   * comment, so a shared branch would render the reason paragraph empty.
   */
  it('carries the rejection reason on AC6 only', () => {
    const reasonOf = (eventName: NOTIFICATIONS_EVENT_NAMES) =>
      activityCreator(payload, eventName, MICRO_SERVICES.givethio, true)
        ?.activities?.[0]?.attributes?.['txt:cm:reason'];
    expect(
      reasonOf(NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED),
    ).to.equal('Needs more detail');
    expect(reasonOf(NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED)).to.equal(
      undefined,
    );
  });
});

/**
 * giveth-v6-core#439 — DOES THE OVERLAY COVER WHAT v6 ACTUALLY SENDS?
 *
 * This is the check whose absence let `Send email confirmation` ship on v5's
 * journey. Nothing compared the overlay's key set against the events v6-core
 * fires, so an event v6 sends with no overlay entry silently inherits a v5
 * journey — v5 copy, v5 footer, no giveth-v6-core#438 unsubscribe — which is
 * the exact failure #439 exists to remove. It is silent twice over: Ortto
 * returns 2xx and the notification row is written either way.
 *
 * `V6_SENT_EVENTS` mirrors giveth-v6-core's `NOTIFICATION_EVENT_NAMES`. A
 * mirror is the thing to avoid where a fact is derivable, and this one is NOT
 * derivable here: the two repos share no build, so nothing in this suite can
 * import that union. The mirror is deliberately of the SHORTER, more stable
 * list (what v6 sends) rather than of the journey ids, and its failure names
 * the event to go and classify.
 *
 * Every entry must be `'overlay'` (reaches a v6 journey) or an EXPLICIT
 * exception with a reason.
 *
 * ⚠️ NOTHING IN THIS REPO CAN SEE A v6-CORE ADDITION, and no case below
 * changes that. `Record<string, Coverage>` is an index signature over all
 * strings and requires no keys, so an event added to v6-core with no entry here
 * is invisible to every case in this block: `routes every v6-sent event` never
 * iterates it, the orphan case passes because the overlay has no entry either,
 * and the count below still reads 19 because THIS table was not touched. The
 * count guards an edit to this table, which is worth having — it forces a
 * deliberate bump — but it is not drift detection.
 *
 * The repo that CAN see the addition is v6-core, and that is where the guard
 * lives: a matching count over its own `NOTIFICATION_EVENT_NAMES` +
 * `PROJECT_STATUS_EVENT_NAMES`, in notifications.service.spec.ts, whose comment
 * names this table. Adding an event there fails there, which is the moment to
 * come and classify it here.
 */
describe('orttoOverlayCoverage', () => {
  type Coverage = 'overlay' | { exception: string };

  const V6_SENT_EVENTS: Record<string, Coverage> = {
    [NOTIFICATIONS_EVENT_NAMES.DONATION_RECEIVED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.DRAFTED_PROJECT_ACTIVATED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_LISTED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_UNLISTED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_CANCELLED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_VERIFIED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_UNVERIFIED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.GIVBACKS_ELIGIBILITY_GRANTED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.VERIFICATION_FORM_REJECTED]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_ADD_AN_UPDATE_USERS_WHO_SUPPORT]:
      'overlay',
    [NOTIFICATIONS_EVENT_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW]:
      'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_WARNING]: 'overlay',
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING]: 'overlay',

    // The GIVbacks form's contact-email confirmation, and sharing v5's journey
    // is CORRECT rather than pending. Not a #439 email (that issue's always-send
    // item is the account code, SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW, which
    // has its own v6 journey); its only variable content is the verify link,
    // which v6 already supplies; and as a flow-critical always-send it must not
    // carry #438's unsubscribe footer. See ORTTO_EVENT_NAMES_V6's docblock.
    [NOTIFICATIONS_EVENT_NAMES.SEND_EMAIL_CONFIRMATION]: {
      exception: 'transactional — v5 journey is correct, no v6 copy wanted',
    },

    // Sends no email at all: ORTTO-category, upserts a contact. Needs no
    // journey, so it has nothing to be routed to.
    [NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT]: {
      exception: 'ORTTO category, sends no email',
    },

    // GIVpower ranks: #439 lists every GIVeconomy notification as out of scope
    // for v6 MVP. v6 carries the event names but no v6 journey exists.
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK]: {
      exception: 'GIVpower, out of scope for v6 MVP',
    },
    [NOTIFICATIONS_EVENT_NAMES.PROJECT_HAS_A_NEW_RANK]: {
      exception: 'GIVpower, out of scope for v6 MVP',
    },
    [NOTIFICATIONS_EVENT_NAMES.YOUR_PROJECT_GOT_A_RANK]: {
      exception: 'GIVpower, out of scope for v6 MVP',
    },
  };

  it('routes every v6-sent event to a v6 journey, or records why not', () => {
    const unrouted = Object.entries(V6_SENT_EVENTS)
      .filter(([, c]) => c === 'overlay')
      .map(([eventName]) => eventName)
      .filter(
        eventName =>
          !ORTTO_EVENT_NAMES_V6[eventName as NOTIFICATIONS_EVENT_NAMES],
      );
    expect(unrouted).to.deep.equal([]);
  });

  it('gives every documented exception a reason', () => {
    Object.entries(V6_SENT_EVENTS)
      .filter(([, c]) => c !== 'overlay')
      .forEach(([eventName, c]) => {
        const reason = (c as { exception: string }).exception;
        expect(reason, eventName).to.be.a('string').and.not.empty;
      });
  });

  /**
   * The other direction: an overlay entry for an event v6 never sends is dead
   * weight pointing at a journey nobody triggers, and it hides the fact that
   * the journey will sit at `entered: 0` for ever.
   */
  it('has no overlay entry for an event v6 does not send', () => {
    const orphans = Object.keys(ORTTO_EVENT_NAMES_V6).filter(
      eventName => !(eventName in V6_SENT_EVENTS),
    );
    expect(orphans).to.deep.equal([]);
  });

  /**
   * Guards the exception LIST from quietly growing. Every entry is a considered
   * decision recorded above; a NEW one appearing without a reason beside it is
   * the thing to catch.
   */
  /**
   * Pins the SIZE OF THIS TABLE, not agreement with v6-core — see the block
   * docblock for why nothing here can check the latter. Its value is that
   * editing this table becomes deliberate: adding or dropping a row without
   * thinking fails, and when it does the answer is to re-read v6-core's
   * `NOTIFICATION_EVENT_NAMES` and classify what is new, not to bump the number.
   *
   * 19 was verified against v6-core on 2026-09-10 — every event name it sends,
   * the four in `PROJECT_STATUS_EVENT_NAMES` included.
   */
  it('has exactly the rows recorded above', () => {
    expect(Object.keys(V6_SENT_EVENTS)).to.have.lengthOf(19);
  });

  it('has exactly the exceptions recorded above', () => {
    const exceptions = Object.entries(V6_SENT_EVENTS)
      .filter(([, c]) => c !== 'overlay')
      .map(([eventName]) => eventName)
      .sort();
    expect(exceptions).to.deep.equal(
      [
        NOTIFICATIONS_EVENT_NAMES.SEND_EMAIL_CONFIRMATION,
        NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT,
        NOTIFICATIONS_EVENT_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
        NOTIFICATIONS_EVENT_NAMES.PROJECT_HAS_A_NEW_RANK,
        NOTIFICATIONS_EVENT_NAMES.YOUR_PROJECT_GOT_A_RANK,
      ].sort(),
    );
  });
});
