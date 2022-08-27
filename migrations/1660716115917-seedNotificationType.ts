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
    title: 'Complete profile',
    content: 'You need to complete your profile.', // Missing copy
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
    title: 'Profile Completed',
    content: 'The profile has been completed', // Missing copy
  },
  DRAFTED_PROJECT_ACTIVATED: {
    name: 'Draft published',
    description: 'Project draft has been published',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_ACTIVATED,
    category: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Draft published',
    pushNotifierService: null,
    title: 'Project is published',
    content: '', // Missing copy
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
    title: 'Project is listed',
    content: 'Well done your project has been published!', // Missing copy
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
    title: 'Project is unlisted - <PLACEHOLDER>',
    content: '', // Missing copy
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
    title: 'Project has been edited',
    content: '', // Missing copy
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
    title: 'Project verification revoked',
    content: '', // Missing copy
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
    title: 'Project verification approved',
    content: '', // Missing copy
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
    title: 'Project verification rejected',
    content: '', // Missing copy
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
    title: 'Project verification removed',
    content: '', // Missing copy
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
    title: 'Project is activated - <PLACEHOLDER>',
    content: '', // Missing copy
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
    title: 'Project is activated - <PLACEHOLDER>',
    content: '', // Missing copy
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
    title: 'Project is cancelled - <PLACEHOLDER>',
    content: '', // Missing copy
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
    title: 'Project verification email confirmation',
    content: '', // Missing copy
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
    title: 'Donation is successfull',
    content: '', // Missing copy
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
    title: 'Project received a donation',
    content: '', // Missing copy
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
    title: 'Project posted an update',
    content: '', // Missing copy
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
    title: 'Project posted an update',
    content: '', // Missing copy
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
    title: 'Project created',
    content: '', // Missing copy
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
    title: 'Updated profile',
    content: '', // Missing copy
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
    title: 'Donation has been failed',
    content: '', // Missing copy
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
    title: 'Project verification under review',
    content: '', // Missing copy
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
