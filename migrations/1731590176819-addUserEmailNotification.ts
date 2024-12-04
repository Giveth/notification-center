import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  SCHEMA_VALIDATORS_NAMES,
  NotificationType,
} from '../src/entities/notificationType';
import { NOTIFICATION_CATEGORY } from '../src/types/general';
import { NOTIFICATIONS_EVENT_NAMES } from '../src/types/notifications';
import { MICRO_SERVICES } from '../src/utils/utils';

const UserEmailConfirmationNotificationCodeFlowType = [
  {
    name: NOTIFICATIONS_EVENT_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
    description:
      NOTIFICATIONS_EVENT_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator:
      SCHEMA_VALIDATORS_NAMES.SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
  },
];

export class AddUserEmailNotification1731590176819
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      NotificationType,
      UserEmailConfirmationNotificationCodeFlowType,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "name" = 'Send email confirmation code flow';`,
    );
  }
}
