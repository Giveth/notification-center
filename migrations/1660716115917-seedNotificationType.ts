import { MigrationInterface, QueryRunner } from 'typeorm';
import { NotificationType } from '../src/entities/notificationType';
import {
  MICRO_SERVICES,
  NOTIFICATION_RESOURCE_TYPES,
  THIRD_PARTY_EMAIL_SERVICES,
} from '../src/utils/utils';
import { SCHEMA_VALIDATORS_NAMES } from '../src/utils/validators/segmentValidators';

export const GivethNotificationTypes = {
  // SEGMENT
  INCOMPLETE_PROFILE: {
    name: 'Incomplete profile',
    description: 'Please complete your profile',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: null,
    resourceType: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
  },
  COMPLETE_PROFILE: {
    name: 'Profile completed',
    description: 'Thanks for completing your profile',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: null,
    resourceType: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
  },
  DRAFTED_PROJECT_ACTIVATED: {
    name: 'Draft published',
    description: 'Project draft has beeen published',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_ACTIVATED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Draft published',
    pushNotifierService: null,
  },
  PROJECT_LISTED: {
    name: 'Project listed',
    description: 'Project has been listed!',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_LISTED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project listed',
    pushNotifierService: null,
  },
  PROJECT_UNLISTED: {
    name: 'Project unlisted',
    description: 'Project has unlisted!',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project unlisted',
    pushNotifierService: null,
  },
  PROJECT_EDITED: {
    name: 'Project edited',
    description: 'Project has been edited',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project edited',
    pushNotifierService: null,
  },
  PROJECT_BADGE_REVOKED: {
    name: 'Project badge revoked',
    description: 'Project verified badge revoked',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project badge revoked',
    pushNotifierService: null,
  },
  PROJECT_VERIFIED: {
    name: 'Project verified',
    description: 'Project has been verified! Rejoice!',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project verified',
    pushNotifierService: null,
  },
  PROJECT_REJECTED: {
    name: 'Project rejected',
    description: 'Project has been rejected!',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_REJECTED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project rejected',
    pushNotifierService: null,
  },
  PROJECT_UNVERIFIED: {
    name: 'Project unverified',
    description: 'Project has been unverified',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project unverified',
    pushNotifierService: null,
  },
  PROJECT_ACTIVATED: {
    name: 'Project activated',
    description: 'Project has been activated!',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project activated',
    pushNotifierService: null,
  },
  PROJECT_DEACTIVATED: {
    name: 'Project deactivated',
    description: 'Project has been deactivated',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project deactivated',
    pushNotifierService: null,
  },
  PROJECT_CANCELLED: {
    name: 'Project cancelled',
    description: 'Project has been cancelled',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project cancelled',
    pushNotifierService: null,
  },
  // DAPP MAILER
  SEND_EMAIL_CONFIRMATION: {
    name: 'Send email confirmation',
    description: 'Project Verification form email confirmation has been sent!',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SEND_EMAIL_CONFIRMATION,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.DAPP_MAILER,
    emailNotificationId: 'Send email confirmation',
    pushNotifierService: null,
  },
  // SEGMENT AGAIN
  MADE_DONATION: {
    name: 'Made donation',
    description: 'User made a donation to a project',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.MADE_DONATION,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Made donation',
    pushNotifierService: null,
  },
  DONATION_RECEIVED: {
    name: 'Donation received',
    description: 'Project has received a donation',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DONATION_RECEIVED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Donation received',
    pushNotifierService: null,
  },
  PROJECT_UPDATED_DONOR: {
    name: 'Project updated - donor',
    description:
      'Send notification to donors that the project has added an updated',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_DONOR,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project updated - donor',
    pushNotifierService: null,
  },
  PROJECT_UPDATED_OWNER: {
    name: 'Project updated - owner',
    description:
      'Send notification to owner that the project has added an update',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_OWNER,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project updated - owner',
    pushNotifierService: null,
  },
  PROJECT_CREATED: {
    name: 'Project created',
    description: 'Project has been created.',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CREATED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project created',
    pushNotifierService: null,
  },
  UPDATED_PROFILE: {
    // No need to notify this
    name: 'Updated profile',
    description: 'User updated his profile',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: null,
    resourceType: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
  },
  GET_DONATION_PRICE_FAILED: {
    name: 'Get Donation Price Failed',
    description: 'Project has been created.',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GET_DONATION_PRICE_FAILED,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Get Donation Price Failed',
    pushNotifierService: null,
  },
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN: {
    name: 'Verification form got draft by admin',
    description: 'Project has been created.',
    microservice: MICRO_SERVICES.givethio,
    schemaValidator:
      SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
    resourceType: NOTIFICATION_RESOURCE_TYPES.PROJECT_ACTIVITIES,
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
