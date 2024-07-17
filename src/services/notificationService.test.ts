import { expect } from 'chai';
import { activityCreator } from './notificationService';
import { NOTIFICATIONS_EVENT_NAMES } from '../types/notifications';

describe('activityCreator', () => {
  it('should create attributes for NOTIFY_REWARD_AMOUNT', () => {
    const payload = {
      round: 1,
      date: '2024-06-01',
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
    );
    expect(JSON.stringify(result)).equal(
      JSON.stringify({
        activities: [
          {
            activity_id: 'act:cm:notify-reward-amount',
            attributes: {
              'int:cm:round': payload.round,
              'str:cm:date': payload.date,
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
});
