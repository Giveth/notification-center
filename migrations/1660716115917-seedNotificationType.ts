import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';
import {
  MICRO_SERVICES,
  NOTIFICATION_RESOURCE_TYPES,
  THIRD_PARTY_EMAIL_SERVICES,
} from '../src/utils/utils';

export const GivethNotificationTypes = {
  // SEGMENT
  INCOMPLETE_PROFILE: {
    name: 'Incomplete profile',
    description: 'Please complete your profile',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    category: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
  },
  COMPLETE_PROFILE: {
    name: 'Profile completed',
    description: 'Thanks for completing your profile',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    category: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
  },
  DRAFTED_PROJECT_ACTIVATED: {
    name: 'Draft published',
    description: 'Project draft has beeen published',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_ACTIVATED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Draft published',
    pushNotifierService: null,
  },
  PROJECT_LISTED: {
    name: 'Project listed',
    description: 'Project has been listed!',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_LISTED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project listed',
    pushNotifierService: null,
  },
  PROJECT_UNLISTED: {
    name: 'Project unlisted',
    description: 'Project has unlisted!',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project unlisted',
    pushNotifierService: null,
  },
  PROJECT_EDITED: {
    name: 'Project edited',
    description: 'Project has been edited',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project edited',
    pushNotifierService: null,
  },
  PROJECT_BADGE_REVOKED: {
    name: 'Project badge revoked',
    description: 'Project verified badge revoked',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project badge revoked',
    pushNotifierService: null,
  },
  PROJECT_VERIFIED: {
    name: 'Project verified',
    description: 'Project has been verified! Rejoice!',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project verified',
    pushNotifierService: null,
  },
  PROJECT_REJECTED: {
    name: 'Project rejected',
    description: 'Project has been rejected!',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_REJECTED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project rejected',
    pushNotifierService: null,
  },
  PROJECT_UNVERIFIED: {
    name: 'Project unverified',
    description: 'Project has been unverified',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project unverified',
    pushNotifierService: null,
  },
  PROJECT_ACTIVATED: {
    name: 'Project activated',
    description: 'Project has been activated!',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project activated',
    pushNotifierService: null,
  },
  PROJECT_DEACTIVATED: {
    name: 'Project deactivated',
    description: 'Project has been deactivated',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project deactivated',
    pushNotifierService: null,
  },
  PROJECT_CANCELLED: {
    name: 'Project cancelled',
    description: 'Project has been cancelled',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project cancelled',
    pushNotifierService: null,
  },
  // DAPP MAILER
  SEND_EMAIL_CONFIRMATION: {
    name: 'Send email confirmation',
    description: 'Project Verification form email confirmation has been sent!',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SEND_EMAIL_CONFIRMATION,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.DAPP_MAILER,
    emailNotificationId: 'Send email confirmation',
    pushNotifierService: null,
  },
  // SEGMENT AGAIN
  MADE_DONATION: {
    name: 'Made donation',
    description: 'User made a donation to a project',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.MADE_DONATION,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Made donation',
    pushNotifierService: null,
  },
  DONATION_RECEIVED: {
    name: 'Donation received',
    description: 'Project has received a donation',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DONATION_RECEIVED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Donation received',
    pushNotifierService: null,
  },
  PROJECT_UPDATED_DONOR: {
    name: 'Project updated - donor',
    description:
      'Send notification to donors that the project has added an updated',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_DONOR,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project updated - donor',
    pushNotifierService: null,
  },
  PROJECT_UPDATED_OWNER: {
    name: 'Project updated - owner',
    description:
      'Send notification to owner that the project has added an update',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_OWNER,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project updated - owner',
    pushNotifierService: null,
  },
  PROJECT_CREATED: {
    name: 'Project created',
    description: 'Project has been created.',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CREATED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project created',
    pushNotifierService: null,
  },
  UPDATED_PROFILE: {
    // No need to notify this
    name: 'Updated profile',
    description: 'User updated his profile',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    category: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
  },
  GET_DONATION_PRICE_FAILED: {
    name: 'Get Donation Price Failed',
    description: 'Project has been created.',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GET_DONATION_PRICE_FAILED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Get Donation Price Failed',
    pushNotifierService: null,
  },
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN: {
    name: 'Verification form got draft by admin',
    description: 'Project has been created.',
    microService: MICRO_SERVICES.givethio,
    schemaValidator:
      SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Verification form got draft by admin',
    pushNotifierService: null,
  },
};

export class seedNotificationType1660716115917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Giveth IO Notifications
    await queryRunner.manager.save(
      NotificationType,
      Object.values(GivethNotificationTypes),
    );

    // Trace notifications

    // Other notifications
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM notification_type`);
  }
}
