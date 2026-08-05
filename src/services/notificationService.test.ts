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
  it('builds the SYNC_ORTTO_CONTACT activity: dedicated inert activity, merges on the v6 user id, stamps the sourced-from-v6 marker', () => {
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
            'str:cm:firstname': 'Ada',
            'str:cm:lastname': 'Lovelace',
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

  it('omits optional names for the SYNC_ORTTO_CONTACT activity (nameless wallet/Turnkey profiles still sync)', () => {
    const result = activityCreator(
      { email: 'contact@example.com', userId: 99 },
      NOTIFICATIONS_EVENT_NAMES.SYNC_ORTTO_CONTACT,
      MICRO_SERVICES.givethio,
    );
    // The merge key, email, and marker survive even with no names supplied.
    expect(result.activities[0].activity_id).to.equal(
      'act:cm:sync-ortto-contact',
    );
    expect(result.merge_by).to.deep.equal(['str:cm:v6-user-id']);
    expect(result.activities[0].fields).to.deep.equal({
      'str::email': 'contact@example.com',
      'str:cm:v6-user-id': '99',
      'bol:cm:sourced-from-v6': true,
    });
    // Absent names are omitted entirely — no `undefined` attributes are sent.
    expect(result.activities[0].attributes).to.deep.equal({
      'str:cm:email': 'contact@example.com',
      'str:cm:v6-user-id': '99',
    });
    expect(result.activities[0].attributes).to.not.have.property(
      'str:cm:firstname',
    );
    expect(result.activities[0].attributes).to.not.have.property(
      'str:cm:lastname',
    );
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
