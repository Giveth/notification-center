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
    name: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_NEW_LOWER_RANK,
    description: 'Project has new lower rank',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_NEW_RANK,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_HAS_NEW_LOWER_RANK,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project has new lower rank',
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
        content: ' has a new lower rank.',
      },
    ],
    content: 'Your project {project name} has a new lower rank.',
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_NEW_HIGHER_RANK,
    description: 'Project has new higher rank',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_NEW_RANK,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_HAS_NEW_HIGHER_RANK,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project has new higher rank',
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
        content: ' has a new higher rank.',
      },
    ],
    content: 'Your project {project name} has a new higher rank.',
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

    // Trace notifications

    // Other notifications
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "categoryGroup" = 'projectNewRank';`,
    );
  }
}
