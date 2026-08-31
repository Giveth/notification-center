import { expect } from 'chai';
import { activityCreator } from './notificationService';
import { NOTIFICATIONS_EVENT_NAMES } from '../types/notifications';
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

/**
 * giveth-v6-core#457 — the suppression mirror of the #426 sync. Its whole job is
 * to unsubscribe the SAME Ortto person the sync created, so the two properties
 * that matter are the merge key (identity) and `bol::p` (the effect).
 */
describe('activityCreator — SUPPRESS_ORTTO_CONTACT (giveth-v6-core#457)', () => {
  it('unsubscribes the contact by v6 user id, on its own inert activity, carrying no email', () => {
    const result = activityCreator(
      { userId: 42 },
      NOTIFICATIONS_EVENT_NAMES.SUPPRESS_ORTTO_CONTACT,
      MICRO_SERVICES.givethio,
    );

    expect(result).to.deep.equal({
      activities: [
        {
          // Its OWN activity, not the sync's: an upsert and an unsubscribe are
          // opposite operations and must be distinguishable in the timeline.
          activity_id: 'act:cm:suppress-ortto-contact',
          attributes: {
            'str:cm:v6-user-id': '42',
          },
          fields: {
            'str:cm:v6-user-id': '42',
            'bol:cm:sourced-from-v6': true,
            // Ortto's email permission. This is the entire point of the event.
            'bol::p': false,
            'str::u-ctx':
              'Giveth v6: profile no longer has a verified canonical email',
          },
        },
      ],
      // Same stable key as the sync, so this unsubscribes exactly the contact
      // v6 created — never a stranger who shares the (stale) address.
      merge_by: ['str:cm:v6-user-id'],
    });
  });

  it('never writes str::email — the only address v6 still holds is the one it just stopped trusting', () => {
    const result = activityCreator(
      // Even if a caller smuggled an address in, it must not reach Ortto.
      { userId: 7, email: 'stale@example.com' },
      NOTIFICATIONS_EVENT_NAMES.SUPPRESS_ORTTO_CONTACT,
      MICRO_SERVICES.givethio,
    );

    expect(result.activities[0].fields).to.not.have.property('str::email');
    expect(JSON.stringify(result)).to.not.contain('stale@example.com');
  });

  it('merges on the v6 user id in production too, never falling through to the generic block', () => {
    const original = process.env.ENVIRONMENT;
    process.env.ENVIRONMENT = 'production';
    try {
      const result = activityCreator(
        { userId: 7 },
        NOTIFICATIONS_EVENT_NAMES.SUPPRESS_ORTTO_CONTACT,
        MICRO_SERVICES.givethio,
      );
      expect(result.merge_by).to.deep.equal(['str:cm:v6-user-id']);
      expect(result.activities[0].fields['bol::p']).to.equal(false);
    } finally {
      if (original === undefined) {
        delete process.env.ENVIRONMENT;
      } else {
        process.env.ENVIRONMENT = original;
      }
    }
  });
});

/**
 * giveth-v6-core#457 — the other half of reversibility. Ortto's email permission
 * is sticky, so the sync has to be able to UNDO a suppression; but it must only
 * ever do so when v6 asks, or a routine re-point would resubscribe someone who
 * opted out through Ortto's own unsubscribe link.
 */
describe('activityCreator — SYNC_ORTTO_CONTACT re-subscribe (giveth-v6-core#457)', () => {
  it('sets bol::p true only when the payload explicitly asks to re-subscribe', () => {
    const result = activityCreator(
      { email: 'contact@example.com', userId: 42, resubscribe: true },
      NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT,
      MICRO_SERVICES.givethio,
    );

    expect(result.activities[0].fields).to.deep.equal({
      'str::email': 'contact@example.com',
      'str:cm:v6-user-id': '42',
      'bol:cm:sourced-from-v6': true,
      'bol::p': true,
      'str::s-ctx': 'Giveth v6: profile regained a verified canonical email',
    });
  });

  it('leaves email permission untouched on an ordinary sync — never sends bol::p false', () => {
    for (const payload of [
      { email: 'contact@example.com', userId: 42 },
      { email: 'contact@example.com', userId: 42, resubscribe: false },
      // Truthy-but-not-true must NOT count: the guard is a strict === true.
      { email: 'contact@example.com', userId: 42, resubscribe: 'yes' },
    ]) {
      const result = activityCreator(
        payload,
        NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT,
        MICRO_SERVICES.givethio,
      );
      expect(result.activities[0].fields).to.not.have.property('bol::p');
      expect(result.activities[0].fields).to.not.have.property('str::s-ctx');
    }
  });
});

describe('suppressOrttoContact segment validator (giveth-v6-core#457)', () => {
  const schema =
    SEGMENT_METADATA_SCHEMA_VALIDATOR.suppressOrttoContact.segment!;

  it("coerces userId to an integer so the merge key matches the sync's exactly", () => {
    const value = validateWithJoiSchema({ userId: '42' }, schema);
    expect(value.userId).to.equal(42);
    expect(value.userId.toString()).to.equal('42');
  });

  it('requires userId — without it the call could not address any contact', () => {
    expect(() => validateWithJoiSchema({}, schema)).to.throw();
  });

  it('rejects a non-integer or non-positive userId', () => {
    expect(() => validateWithJoiSchema({ userId: -1.5 }, schema)).to.throw();
    expect(() => validateWithJoiSchema({ userId: 0 }, schema)).to.throw();
    expect(() => validateWithJoiSchema({ userId: 'abc' }, schema)).to.throw();
  });

  it('rejects an email — the suppression payload is deliberately id-only', () => {
    expect(() =>
      validateWithJoiSchema({ userId: 42, email: 'stale@example.com' }, schema),
    ).to.throw();
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

  // giveth-v6-core#457: optional, and absent for every ordinary sync.
  it('accepts an optional resubscribe flag and coerces it', () => {
    expect(
      validateWithJoiSchema(
        { email: 'a@b.com', userId: 42, resubscribe: true },
        schema,
      ).resubscribe,
    ).to.equal(true);
    expect(
      validateWithJoiSchema({ email: 'a@b.com', userId: 42 }, schema)
        .resubscribe,
    ).to.equal(undefined);
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
        'str:cm:verified-status': 'givbacks-eligible',
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

      expect(givoStatus(givbacks)).to.equal('givbacks-eligible');
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
