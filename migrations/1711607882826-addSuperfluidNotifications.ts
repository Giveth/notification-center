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
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
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
        type: 'a',
        content: '{underlyingTokenSymbol}',
        href: '#', // Placeholder for dynamic token symbol link
      },
      {
        type: 'p',
        content: ' on ',
      },
      {
        type: 'a',
        content: '{network}',
        href: '#', // Placeholder for dynamic network link
      },
      {
        type: 'p',
        content: ' will run out in 1 month, ',
      },
      {
        type: 'a',
        content: 'top-up here.',
        href: 'Link to my recurring donations tab', // Actual link goes here
      },
    ],
    content:
      'Your Stream Balance of {underlyingTokenSymbol} on {network} will run out in 1 month, top-up here.',
  },
  {
    name: 'One week left in stream balance',
    description: 'Stream balance of underlying token will run out in 1 week',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
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
        type: 'a',
        content: '{underlyingTokenSymbol}',
        href: '#', // Placeholder for dynamic token symbol link
      },
      {
        type: 'p',
        content: ' on ',
      },
      {
        type: 'a',
        content: '{network}',
        href: '#', // Placeholder for dynamic network link
      },
      {
        type: 'p',
        content: ' will run out in 1 week, ',
      },
      {
        type: 'a',
        content: 'top-up here.',
        href: 'Link to my recurring donations tab', // Actual link goes here
      },
    ],
    content:
      'Your Stream Balance of {underlyingTokenSymbol} on {network} will run out in 1 week, top-up here.',
  },
  {
    name: 'Stream balance depleted',
    description: 'Stream balance in token has run out of funds',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
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
        type: 'a',
        content: '{tokenSymbol}',
        href: '#', // Placeholder for dynamic token symbol link
      },
      {
        type: 'p',
        content: ' on ',
      },
      {
        type: 'a',
        content: '{network}',
        href: '#', // Placeholder for dynamic network link
      },
      {
        type: 'p',
        content:
          ' has run out of funds, subsequently some of your recurring donations have ended. ',
      },
      {
        type: 'a',
        content: 'Manage your Recurring Donations',
        href: 'Link to manage recurring donations', // Actual link goes here
      },
    ],
    content:
      'Your Stream Balance in {tokenSymbol} on {network} has run out of funds, subsequently some of your recurring donations have ended. Manage your Recurring Donations',
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
