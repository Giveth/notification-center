import { MigrationInterface, QueryRunner } from 'typeorm';
import { NOTIFICATION_CATEGORY_GROUPS } from '../src/entities/notificationSetting';
import { NOTIFICATION_CATEGORY } from '../src/types/general';
import { MICRO_SERVICES } from '../src/utils/utils';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';

export const superFluidNotificationTypes = [
  {
    name: 'One month left in stream balance',
    description: 'Stream balance of underlying token will run out in 1 month',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GENERAL,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SUPERFLUID,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.SUPERFLUID,
    title: 'One Month Left in Stream Balance',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Stream Balance of ',
      },
      {
        type: 'p',
        content: '$tokenSymbol',
      },
      {
        type: 'p',
        content: ' on ',
      },
      {
        type: 'p',
        content: '$networkName',
      },
      {
        type: 'p',
        content: ' will run out in 1 month, ',
      },
      {
        type: 'a',
        content: 'top-up here.',
        href: '$recurringDonationTab', // Actual link goes here
      },
    ],
  },
  {
    name: 'One week left in stream balance',
    description: 'Stream balance of underlying token will run out in 1 week',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GENERAL,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SUPERFLUID,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.SUPERFLUID,
    title: 'One Week Left in Stream Balance',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Stream Balance of ',
      },
      {
        type: 'p',
        content: '$tokenSymbol',
      },
      {
        type: 'p',
        content: ' on ',
      },
      {
        type: 'p',
        content: '$networkName',
      },
      {
        type: 'p',
        content: ' will run out in 1 week, ',
      },
      {
        type: 'a',
        content: 'top-up here.',
        href: '$recurringDonationTab', // Actual link goes here
      },
    ],
  },
  {
    name: 'Stream balance depleted',
    description: 'Stream balance in token has run out of funds',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GENERAL,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SUPERFLUID,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.SUPERFLUID,
    title: 'Stream Balance Depleted',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Stream Balance in ',
      },
      {
        type: 'p',
        content: '$tokenSymbol',
      },
      {
        type: 'p',
        content: ' on ',
      },
      {
        type: 'p',
        content: '$networkName',
      },
      {
        type: 'p',
        content:
          ' has run out of funds, subsequently some of your recurring donations have ended. ',
      },
      {
        type: 'a',
        content: 'Manage your Recurring Donations',
        href: '$recurringDonationTab', // Actual link goes here
      },
    ],
  },
];

export class addSuperfluidNotifications1711607882826
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      NotificationType,
      superFluidNotificationTypes,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "categoryGroup" = 'superfluid';`,
    );
  }
}
