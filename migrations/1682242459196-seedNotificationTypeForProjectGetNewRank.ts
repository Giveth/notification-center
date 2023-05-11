import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';
import { MICRO_SERVICES, THIRD_PARTY_EMAIL_SERVICES } from '../src/utils/utils';
import {
  NOTIFICATION_CATEGORY,
  NOTIFICATION_TYPE_NAMES,
} from '../src/types/general';
import { NOTIFICATION_CATEGORY_GROUPS } from '../src/entities/notificationSetting';
import { SegmentEvents } from '../src/services/segment/segmentAnalyticsSingleton';

// https://github.com/Giveth/notification-center/issues/6 , https://gist.github.com/MohammadPCh/24434d50bc9ccd9b74905c271ee05482
// icons https://gist.github.com/MohammadPCh/31e2b750dd9aa54edb21dcc6e7332efb
export const GivethNotificationTypes = [
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_A_NEW_RANK,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_A_NEW_RANK,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_NEW_RANK,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_HAS_A_NEW_RANK,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_A_NEW_RANK,
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' has a new rank.',
      },
    ],
    content: 'Your project {project name} has a new rank.',
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_NEW_RANK,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' has risen in the rank.',
      },
    ],
    content: 'Your project {project name} has has risen in the rank.',
  },
  {
    name: NOTIFICATION_TYPE_NAMES.YOUR_PROJECT_GOT_A_RANK,
    description: NOTIFICATION_TYPE_NAMES.YOUR_PROJECT_GOT_A_RANK,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_NEW_RANK,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.YOUR_PROJECT_GOT_A_RANK,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: NOTIFICATION_TYPE_NAMES.YOUR_PROJECT_GOT_A_RANK,
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' got a rank.',
      },
    ],
    content: 'Your project {project name} got a rank.',
  },

  // This just for grouping and showing on setting page
  {
    name: 'New Rank',
    title: 'New Rank',
    description: 'Notify me when my project has a new rank.',
    showOnSettingPage: true,
    emailDefaultValue: false,
    webDefaultValue: true,
    isEmailEditable: false,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_NEW_RANK,
    isGroupParent: true,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
  },
];

export class seedNotificationTypeForProjectGetNewRank1682242459196
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Giveth IO Notifications
    await queryRunner.manager.save(NotificationType, GivethNotificationTypes);

    // Fetch the notificationType id for 'New Rank'
    const result = await queryRunner.query(
      `SELECT id FROM "notification_type" WHERE "categoryGroup" = 'projectNewRank';`,
    );
    for (const row of result) {
      await queryRunner.query(`
        INSERT INTO "notification_setting" (
        "allowNotifications",
        "allowEmailNotification",
        "allowDappPushNotification",
        "notificationTypeId",
        "userAddressId",
        "createdAt",
        "updatedAt"
       )
        SELECT
            true, -- For these notificationTypes, allowNotifications is true
            false, -- For these notificationTypes, allowNotifications is true
            true, -- For these notificationTypes, allowNotifications is true
            ${row.id}, -- New Rank notificationType id
            "user_address"."id", -- UserAddress id
            NOW(), -- Current timestamp for createdAt
            NOW() -- Current timestamp for updatedAt
        FROM user_address;
    `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "categoryGroup" = 'projectNewRank';`,
    );
  }
}
