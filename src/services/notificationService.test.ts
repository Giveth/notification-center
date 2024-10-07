import { expect } from 'chai';
import { activityCreator } from './notificationService';
import { NOTIFICATIONS_EVENT_NAMES } from '../types/notifications';
import { MICRO_SERVICES } from '../utils/utils';

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

  it('should create attributes for PROJECT_OWNER_CHANGED_TO', () => {
    const payload = {
      email: 'test@example.com',
      ownerName: 'Test Owner',
      projectName: 'Test Project',
    };
    const result = activityCreator(
      payload,
      NOTIFICATIONS_EVENT_NAMES.PROJECT_OWNERSHIP_CHANGED_TO,
    );
    expect(JSON.stringify(result)).equal(
      JSON.stringify({
        activities: [
          {
            activity_id: 'act:cm:ownership-changed-to',
            attributes: {
              'str:cm:ownername': payload.ownerName,
              'str:cm:projectname': payload.projectName,
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

  it('should create attributes for PROJECT_OWNER_CHANGED_FROM', () => {
    const payload = {
      email: 'test@example.com',
      ownerName: 'Test Owner',
      projectName: 'Test Project',
    };
    const result = activityCreator(
      payload,
      NOTIFICATIONS_EVENT_NAMES.PROJECT_OWNERSHIP_CHANGED_FROM,
    );
    expect(JSON.stringify(result)).equal(
      JSON.stringify({
        activities: [
          {
            activity_id: 'act:cm:ownership-changed-from',
            attributes: {
              'str:cm:ownername': payload.ownerName,
              'str:cm:projectname': payload.projectName,
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
