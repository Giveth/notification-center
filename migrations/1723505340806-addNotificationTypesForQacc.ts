import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NOTIFICATION_CATEGORY,
  NOTIFICATION_TYPE_NAMES,
} from '../src/types/general';
import { SCHEMA_VALIDATORS_NAMES } from '../src/entities/notificationType';
import { MICRO_SERVICES } from '../src/utils/utils';

const QaccNotificationTypes = [
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_SUPPORTED,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_SUPPORTED,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED_WHO_SUPPORTED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_SUPPORTED,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_SUPPORTED,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_LISTED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_LISTED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.DRAFT_PUBLISHED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.DRAFT_PUBLISHED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_ACTIVATED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.DRAFT_PROJECT_HAS_BEEN_SAVED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.DRAFT_PROJECT_HAS_BEEN_SAVED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_SAVED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_BOOSTED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_BOOSTED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_HAS_BEEN_BOOSTED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_BOOSTED_BY_PROJECT_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_BOOSTED_BY_PROJECT_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.USER_BOOSTED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_SUPPORTED,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_SUPPORTED,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_SUPPORTED,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_SUPPORTED,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_SUPPORTED,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_SUPPORTED,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_SUPPORTED,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_SUPPORTED,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_OWNER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_OWNER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_SUPPORTED,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_SUPPORTED,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED_WHO_SUPPORTED,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_REMINDER,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_REMINDER,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKE_REMINDER,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_WARNING,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_WARNING,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKE_WARNING,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_UP_FOR_REVOKING,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_UP_FOR_REVOKING,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_UP_FOR_REVOKING,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
    description: NOTIFICATION_TYPE_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator:
      SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UPDATE_ADDED,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_UPDATE_ADDED,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_ADDED_WHO_SUPPORTS,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_A_NEW_RANK,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_A_NEW_RANK,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_HAS_A_NEW_RANK,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_HAS_RISEN_IN_THE_RANK,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.YOUR_PROJECT_GOT_A_RANK,
    description: NOTIFICATION_TYPE_NAMES.YOUR_PROJECT_GOT_A_RANK,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.YOUR_PROJECT_GOT_A_RANK,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.SUBSCRIBE_ONBOARDING,
    description: NOTIFICATION_TYPE_NAMES.SUBSCRIBE_ONBOARDING,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SUBSCRIBE_ONBOARDING,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.CREATE_ORTTO_PROFILE,
    description: NOTIFICATION_TYPE_NAMES.CREATE_ORTTO_PROFILE,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.CREATE_ORTTO_PROFILE,
  },
  {
    name: NOTIFICATION_TYPE_NAMES.NOTIFY_REWARD_AMOUNT,
    description: NOTIFICATION_TYPE_NAMES.NOTIFY_REWARD_AMOUNT,
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.NOTIFY_REWARD_AMOUNT,
  },
];

export class AddNotificationTypesForQacc1723505340806
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save('notification_type', QaccNotificationTypes);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const names = QaccNotificationTypes.map(nt => nt.name);
    await queryRunner.query(
      `DELETE FROM notification_type WHERE name IN (${names.map(name => `'${name}'`).join(', ')}) AND "microService" = 'qacc';`,
    );
  }
}
